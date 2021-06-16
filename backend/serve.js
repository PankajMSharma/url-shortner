require('dotenv').config({ path: './.env' });
const logger = require('./logger')
const express = require('express');
const { HTTP_STATUS } = require('./consts/http-error-status');
const cors = require('cors');
var path = require('path');
require('./database/db.config')

const customResponse = require('./response');

const DEFAULT_PORT = 4201;

/* 
 * Warn if .env file not found 
 */
if (!process.env.BACKEND_HOSTNAME) {
    console.warn('.ENV file not found.')
    logger.warn('.ENV file not found.')
}

const app = express();
app.use(express.json());

// Allow request from all public origins
app.use(cors());

/**
 * Set View Engine to pug
**/
app.set('view engine', 'pug')

/* 
 * Location for views
**/
app.set('views', './backend/views')

/**
 * Set path to static resource files
**/
app.use("/static", express.static(path.join(__dirname, "public")));

/** 
 * Test Request Handler
**/
app.get('', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!',
    tableRows: [{ srNum: 1, shortUrl: 'sdfssd', fullUrl: 'http://facebook.com', frequency: 23 }] })
})

/**
 * Global Exception Handeler for all HTTP requests
**/
function globalErrorHandler (err, req, res, next) {
    logger.error(`Global Error Handeler Found Error: ${err.stack}`)
    const error = customResponse.create(null, HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
                                        HTTP_STATUS.INTERNAL_SERVER_ERROR.code, err);

    // Send error if header not sent already
    if (!res.headerSent) return res.status(500).json(error);
}

/* Set Global Error Handeler */
app.use(globalErrorHandler);

/**
 * Start node application
**/
app.listen(process.env.BACKEND_PORT || DEFAULT_PORT, function() {
    const logMessage = `App Server listening at http://${process.env.BACKEND_HOSTNAME}:${process.env.BACKEND_PORT || DEFAULT_PORT}`;
    logger.info(logMessage)
});