const authService = require('../services/authService');
const ResponseHandler = require('../utils/responseHandler');
const Logger = require('../utils/logger');

class AuthController {
    // Login
    async login(req, res, next) {
        try {
            const { usuario, password } = req.body;

            if (!usuario || !password) {
                return ResponseHandler.error(
                    res,
                    'Usuario y contraseña son requeridos',
                    400
                );
            }

            const result = await authService.login(usuario, password);

            Logger.info('Login exitoso', { usuario: result.user.usuario });

            return ResponseHandler.success(
                res,
                result,
                'Login exitoso',
                200
            );
        } catch (error) {
            Logger.error('Error en login:', error);
            
            if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
                return ResponseHandler.error(
                    res,
                    'Credenciales inválidas',
                    401
                );
            }

            next(error);
        }
    }

    // Obtener perfil del usuario autenticado
    async getProfile(req, res, next) {
        try {
            const user = await authService.getUserById(req.user.id_usuario);

            return ResponseHandler.success(
                res,
                user,
                'Perfil obtenido exitosamente'
            );
        } catch (error) {
            Logger.error('Error al obtener perfil:', error);
            next(error);
        }
    }

    // Verificar token
    async verifyToken(req, res) {
        try {
            return ResponseHandler.success(
                res,
                { valid: true, user: req.user },
                'Token válido'
            );
        } catch (error) {
            Logger.error('Error al verificar token:', error);
            return ResponseHandler.error(res, 'Token inválido', 401);
        }
    }
}

module.exports = new AuthController();