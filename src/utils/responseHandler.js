class ResponseHandler {
    static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message = 'Error en el servidor', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    }

    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ResponseHandler;