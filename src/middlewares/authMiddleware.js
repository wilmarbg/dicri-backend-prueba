const jwt = require('jsonwebtoken');
const ResponseHandler = require('../utils/responseHandler');
const Logger = require('../utils/logger');

// Verificar token
const verifyToken = (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return ResponseHandler.error(
                res,
                'Token no proporcionado',
                401
            );
        }

        // Verificar token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                Logger.warn('Token inválido o expirado', { error: err.message });
                return ResponseHandler.error(
                    res,
                    'Token inválido o expirado',
                    403
                );
            }

            // Agregar información del usuario al request
            req.user = decoded;
            next();
        });
    } catch (error) {
        Logger.error('Error en verificación de token:', error);
        return ResponseHandler.error(res, 'Error al verificar token', 500);
    }
};

// Verificar rol
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ResponseHandler.error(
                res,
                'Usuario no autenticado',
                401
            );
        }

        const userRole = req.user.nombre_rol;

        if (!allowedRoles.includes(userRole)) {
            Logger.warn('Acceso denegado por rol', {
                usuario: req.user.usuario,
                rol: userRole,
                rolesPermitidos: allowedRoles
            });

            return ResponseHandler.error(
                res,
                'No tiene permisos para realizar esta acción',
                403
            );
        }

        next();
    };
};

const isTecnico = verifyRole('Tecnico', 'Coordinador', 'Administrador');
const isCoordinador = verifyRole('Coordinador', 'Administrador');
const isAdmin = verifyRole('Administrador');

module.exports = {
    verifyToken,
    verifyRole,
    isTecnico,
    isCoordinador,
    isAdmin
};