require('dotenv').config({ path: './.env' });
const express = require('express');
const { HTTP_STATUS } = require('./consts/http-error-status');
const cors = require('cors');

const customResponse = require('./response');
const DEFAULT_PORT = 4201;

/* 
 * Warn if .env file not found 
 */
if (!process.env.BACKEND_HOSTNAME) {
    console.warn('.ENV file not found.')
}

const app = express();
app.use(express.json());

// Allow request from all public origins
app.use(cors());

/** 
 * Test Request Handler
**/
app.get('', function (req, res) {
    res.sendStatus(200)
})

/**
 * Global Exception Handeler for all HTTP requests
**/
function globalErrorHandler (err, req, res, next) {
    console.log('Into Global Error Handeler ', res.status)
    const error = customResponse.create(null, 'Internal Server Error', 500, err);

    // Send error if header not sent already
    if (!res.headerSent) return res.status(500).json(error);
}

/* Set Global Error Handeler */
app.use(globalErrorHandler);

/**
 * Start node application
**/
app.listen(process.env.BACKEND_PORT || DEFAULT_PORT, function() {
    console.log(`App Server listening at http://${process.env.BACKEND_HOSTNAME}:${process.env.BACKEND_PORT || DEFAULT_PORT}`)
});