const { validationResult } = require('express-validator');
const ResponseHandler = require('../utils/responseHandler');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));

        return ResponseHandler.validationError(res, formattedErrors);
    }

    next();
};

module.exports = validateRequest;