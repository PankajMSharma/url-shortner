'use strict';
require('dotenv').config({ path: './.env' });
const dbConn = require('mysql2-promise')();
const logger = require('../logger')

try {
    //mysql db connection
    dbConn.configure({
    'host'     : process.env.DB_HOSTNAME,
    'user'     : process.env.DB_USER,
    'password' : process.env.DB_PASSWORD,
    'database' : process.env.DB_NAME
    });
} catch (err) {
    logger.error(`Database connection error: ${err}`)
}

logger.info('Database Connected!')

module.exports = dbConn;