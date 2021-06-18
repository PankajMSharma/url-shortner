require('dotenv').config({ path: './.env' });
const logger = require('./logger')
const express = require('express');
const { HTTP_STATUS } = require('./consts/http-error-status');
const cors = require('cors');
var path = require('path');
const bodyParser = require('body-parser');
var routes = require('./routes')
require('./database/db.config')
const Urls = require('./database/model/urls.model')
// var { REQUEST_ID } = require('./consts/request-id')
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

// for parsing application/json
app.use(bodyParser.json()); 

// Set View Engine to pug
app.set('view engine', 'pug')

// Set location for views
app.set('views', './backend/views')

// Set path to static resource files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Add routes
app.use('', routes)

/**
 * Global Exception Handeler for all HTTP requests
**/
function globalErrorHandler (err, req, res, next) {
    logger.error(`Global Error Handeler Found Error: ${err.stack}`)
    const error = customResponse.create(null, HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
                                        HTTP_STATUS.INTERNAL_SERVER_ERROR.code, err);

    // Send error if header not already sent
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