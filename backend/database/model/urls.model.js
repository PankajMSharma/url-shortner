'use strict';
const logger = require('../../logger');
var dbConn = require('../db.config')

const URL_CONST = {
    TABLE: 'urls',
    SHORT_URL_CODE_MAX_LENGTH: 10,
    SHORT_URL_CODE_MIN_LENGTH: 1,
    LONG_URL_MAX_LENGTH: 2048, // This is maximum accepted size of urls by leading search engines
    DEFAULT_URL_FREQUENCY: 0,
}

class Urls {
    constructor(urlData) {
        this.validate(urlData)
    }

    setShortUrlCode(shortUrlCode) {
        if (!shortUrlCode) { throw Error('Short Url Code is missing') }

        if (shortUrlCode.length > URL_CONST.SHORT_URL_CODE_MAX_LENGTH)
            throw Error(`Short Url Code "${shortUrlCode}" cannot be greater than ${URL_CONST.SHORT_URL_CODE_MAX_LENGTH}`)

        if (shortUrlCode.length < URL_CONST.SHORT_URL_CODE_MIN_LENGTH)
            throw Error(`Short Url Code "${shortUrlCode}" cannot be lesser than ${URL_CONST.SHORT_URL_CODE_MIN_LENGTH}`)

        this.short_url_code = shortUrlCode;
    }

    setLongUrl(longUrl) {
        if (!longUrl) { throw Error('Long Url is missing') }

        if (longUrl.length > URL_CONST.LONG_URL_MAX_LENGTH)
            throw Error(`Long Url "${longUrl}" length cannot be greater than ${URL_CONST.LONG_URL_MAX_LENGTH}`)

        if (!/\b(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/.test(longUrl)) {
            throw Error('Long Url is not valid')
        }

        this.long_url = longUrl;
    }

    setClicks(clicks) {
        if (!clicks) { this.clicks = URL_CONST.DEFAULT_URL_FREQUENCY; return; }

        if (typeof clicks !== 'number' || clicks < 0 || clicks % 1 != 0)
            throw Error(`Usage Frequency ${clicks} is not a valid integer.`)

        this.clicks = clicks;
    }

    validate(urlData) {
        if (!urlData) throw Error('Nothing o validate for Url Object')

        if (!!urlData.id) this.id = urlData.id;

        this.setShortUrlCode(urlData.shortUrlCode)
        this.setLongUrl(urlData.longUrl)
        this.setClicks(urlData.clicks)
    }
}

Urls.create = async (urlData) => {
    if (!(urlData instanceof Urls)) throw Error(`${urlData} is not valid instance of 'Urls'`)

    try {
        let insertId;
        await dbConn.query(`INSERT INTO ${URL_CONST.TABLE} set ?`, [urlData])
                    .spread(rows => {
                        logger.info(`New Short Url added to database. InsertionId: ${rows.insertId}`)
                        insertId = rows.insertId;
                    });

        return insertId;
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw err
        } else {
            throw Error(`Error while creating Url ${urlData} : ${err}`)
        }
    }
}

Urls.getAll = async (offset = 0, limit = 10) => {
    try {
        let response;
        const query = `SELECT * FROM ${URL_CONST.TABLE}
                    ORDER BY id DESC
                    LIMIT ?,?`
        
        await dbConn.query(query, [offset, limit] )
                    .spread(rows => {
                        response = rows;
                    });

        return response;
    } catch (err) {
        throw Error(`Error while getting all Urls list : ${err}`)
    }
}

Urls.getLastRecord = async () => {
    try {
        let id;
        const query = `SELECT id FROM ${URL_CONST.TABLE} ORDER BY id DESC LIMIT 1`

        await dbConn.query(query)
                    .spread(row => {
                        id = !row || !row.length ? null : row[0].id;
                    });
        return id;
    } catch (err) {
        throw Error(`Error while fetching last record of url : ${err}`)
    }
}

Urls.updateClick = async (id, longUrl) => {
    let result;
    const query = `UPDATE ${URL_CONST.TABLE}
                    SET clicks = clicks + 1 
                    WHERE id = ?`

    await dbConn.query(query, [id])
                .spread(function (rows) {
                    result = !!rows.affectedRows;
                    logger.info(`Clicks for ${longUrl} updated`)
                })
    return result;
}

Urls.getLongUrlByShortUrlCode = async (shortUrlCode) => {
    try {
        let result;
        const query = `SELECT id, long_url FROM ${URL_CONST.TABLE} WHERE short_url_code = ?`

        await dbConn.query(query, [shortUrlCode])
                    .spread(rows => {
                        result = !rows || !rows.length ? null : rows[0];
                    });
        return result;
    } catch (err) {
        throw Error(`Error while getLongUrlByShortUrlCode : ${err}`)
    }
}

module.exports = Urls;