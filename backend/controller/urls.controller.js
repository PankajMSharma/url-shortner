'use strict';
const Urls = require('../database/model/urls.model');
const logger = require('../logger');
const { HTTP_STATUS } = require('../consts/http-error-status')
const customResponse = require('../response')
const { convertIdToShortURL } = require('../utils/url-converter')


exports.create = async (req, res) => {
    if (!req.body || !req.body.longUrl) {
        logger.error(`Empty body: ${req.body}`)
        const response = customResponse.create(null, 
                    HTTP_STATUS.REQUIRED_FIELDS_MISSING.message, 
                    HTTP_STATUS.REQUIRED_FIELDS_MISSING.code, 
                    null);
        return res.status(HTTP_STATUS.REQUIRED_FIELDS_MISSING.code).send(response);
    }

    try {
        // Get Lastt Row ID from database
        let lastRecordId = await Urls.getLastRecord();

        // If no record found, Initiazed to 1 already.
        if (!lastRecordId) {
            logger.info('Empty Url table. Default Value for last row = 0')
            lastRecordId = 0;
        }

        lastRecordId = +lastRecordId + 1;
        try {
            const shortUrl = await convertIdToShortURL(lastRecordId) // creates short url
            logger.info(`Short Url ${shortUrl} generated for id: ${lastRecordId}`)

            const intialUnvalidatedUrlObject = {
                id: lastRecordId,
                shortUrlCode: shortUrl,
                longUrl: req.body.longUrl,
                clicks: 0
            }

            // Validate and get url model
            const urlModel = new Urls(intialUnvalidatedUrlObject)

            const insertId = await Urls.create(urlModel)

            if (!insertId) {
                logger.error(`${urlModel} could not be inserted`)
                return res.send(500)
            }

            res.status(201).json({ shortUrlCode: shortUrl })
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                logger.error(`Duplicate request for creating url: ${error.stack}`)
                const response = customResponse.create(null, 
                    HTTP_STATUS.DUPLICATE_URL.message, 
                    HTTP_STATUS.DUPLICATE_URL.code, 
                    null);
                return res.status(HTTP_STATUS.DUPLICATE_URL.code).send(response);
            }
            throw Error(error)
        }
    } catch (err) {
        logger.error(`Error while getting creating url record: ${err.stack}`)
        const response = customResponse.create(null, 
            HTTP_STATUS.INTERNAL_SERVER_ERROR.message, 
            HTTP_STATUS.INTERNAL_SERVER_ERROR.code, 
            null);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).send(response);
    }
}

exports.getAll = async (req, res) => {
    if (!req.body) {
        logger.error(`Empty body: ${req.body}`)
        const response = customResponse.create(null, 
                    HTTP_STATUS.REQUIRED_FIELDS_MISSING.message, 
                    HTTP_STATUS.REQUIRED_FIELDS_MISSING.code, 
                    null);
        return res.status(HTTP_STATUS.REQUIRED_FIELDS_MISSING.code).send(response);
    }

    try {
        const offset = req.query.offset ? +req.query.offset : 0;
        const limit = req.query.limit ? +req.query.limit : 10;

        const response = await Urls.getAll(offset, limit)

        if (!response.length) {
            logger.info(`No record found`)
            return res.render('index', { tableRows: [], offset, limit })
        }

        let index = offset;
        const tableRows = response.map(record => {
            return {
                srNum: ++index, 
                shortUrl: record.short_url_code,
                fullUrl: record.long_url, 
                clicks: record.clicks
            }
        })

        res.render('index', { tableRows, offset, limit })

    } catch (err) {
        logger.error(`Error while getting all url records: ${err.stack}`)
        const response = customResponse.create(null,
            HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
            null);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).send(response);
    }
}

exports.clickedLink = async (req, res) => {
    try {
        const shortUrlCode = req.params.shortUrlCode;
        const urlRecord = await Urls.getLongUrlByShortUrlCode(shortUrlCode)

        if (!urlRecord) {
            logger.error(`Now record found for ${shortUrlCode}`)
            throw Error(`Now record found for ${shortUrlCode}`)
        }

        const updated = await Urls.updateClick(urlRecord.id, urlRecord.long_url)

        if (!updated) {
            logger.error(`Clicks for ${shortUrlCode} could not update`)
            throw Error(`Clicks for ${shortUrlCode} could not update`)
        }

        return res.redirect(urlRecord.long_url)
    } catch (err) {
        logger.error(`Error while updating usage: ${err.stack}`)
        const response = customResponse.create(null,
            HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
            null);
        return res.render('404', {
            shortUrlCode: req.params.shortUrlCode,
            response: response 
        })
    }
}