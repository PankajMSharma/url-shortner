
/** 
 * HTTP Status for custom response
**/
const HTTP_STATUS = {
    REQUIRED_FIELDS_MISSING: { code: 400, message: 'Please provide required field' },
    INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
    NO_RECORD_FOUND: { code: 204, message: 'No Content' },
    DUPLICATE_URL : { code: 205, message: 'Duplicate URL'}
}

exports.HTTP_STATUS = HTTP_STATUS;