'use strict';

/**
 * Custom Response format for all http requests
 */
var create = function (data, errMessage, statusCode, errStack) {
    let response = { data: data , error: null };

    if (errMessage) {
        response.error = {
            message: errMessage,
            status: statusCode,
            stack: errStack
        }
    }

    return response;
}

exports.create = create;