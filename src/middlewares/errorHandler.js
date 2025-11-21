const Logger = require('../utils/logger');
const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
    // Log del error
    Logger.error('Error capturado:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Error de validación de express validator
    if (err.name === 'ValidationError') {
        return ResponseHandler.validationError(res, err.errors);
    }

    // Error de SQL Server
    if (err.name === 'RequestError') {
        return ResponseHandler.error(
            res,
            'Error en la base de datos',
            500,
            process.env.NODE_ENV === 'development' ? err.message : null
        );
    }

    // Error de token
    if (err.name === 'JsonWebTokenError') {
        return ResponseHandler.error(res, 'Token inválido', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return ResponseHandler.error(res, 'Token expirado', 401);
    }

    // Error por defecto
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    return ResponseHandler.error(
        res,
        message,
        statusCode,
        process.env.NODE_ENV === 'development' ? err.stack : null
    );
};

module.exports = errorHandler;