const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection, sql } = require('../config/database');
const Logger = require('../utils/logger');

class AuthService {
    // Login de usuario
    async login(usuario, password) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('usuario', sql.VarChar(50), usuario)
                .execute('sp_LoginUsuario');

            if (result.recordset.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            const user = result.recordset[0];
            Logger.info('DATA USER:', user);
            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            Logger.info('MATCH USUARIO:', isPasswordValid);

            if (!isPasswordValid) {
                throw new Error('Contraseña incorrecta');
            }

            // Generar token
            const token = jwt.sign(
                {
                    id_usuario: user.id_usuario,
                    usuario: user.usuario,
                    nombre_completo: user.nombre_completo,
                    id_rol: user.id_rol,
                    nombre_rol: user.nombre_rol,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // Retornar datos del usuario sin el hash
            const { password_hash, ...userWithoutPassword } = user;

            return {
                token,
                user: userWithoutPassword
            };
        } catch (error) {
            Logger.error('Error en login:', error);
            throw error;
        }
    }

    // Obtener usuario por ID
    async getUserById(id_usuario) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_usuario', sql.Int, id_usuario)
                .execute('sp_ObtenerUsuario');

            if (result.recordset.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al obtener usuario:', error);
            throw error;
        }
    }

    // Verificar token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            Logger.error('Error al verificar token:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();