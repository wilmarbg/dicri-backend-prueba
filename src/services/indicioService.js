const { getConnection, sql } = require('../config/database');
const Logger = require('../utils/logger');

class IndicioService {
    // Crear indicio
    async crearIndicio(data) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_expediente', sql.Int, data.id_expediente)
                .input('codigo_indicio', sql.VarChar(50), data.codigo_indicio)
                .input('id_tipo_indicio', sql.Int, data.id_tipo_indicio)
                .input('descripcion', sql.Text, data.descripcion)
                .input('color', sql.VarChar(50), data.color || null)
                .input('tamano', sql.VarChar(100), data.tamano || null)
                .input('peso', sql.Decimal(10, 2), data.peso || null)
                .input('unidad_peso', sql.VarChar(20), data.unidad_peso || null)
                .input('ubicacion_hallazgo', sql.VarChar(200), data.ubicacion_hallazgo || null)
                .input('id_tecnico_registra', sql.Int, data.id_tecnico_registra)
                .input('observaciones', sql.Text, data.observaciones || null)
                .execute('sp_InsertarIndicio');

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al crear indicio:', error);
            throw error;
        }
    }

    // Obtener indicios por expediente
    async obtenerIndiciosPorExpediente(id_expediente) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_expediente', sql.Int, id_expediente)
                .execute('sp_ObtenerIndiciosPorExpediente');

            return result.recordset;
        } catch (error) {
            Logger.error('Error al obtener indicios:', error);
            throw error;
        }
    }

    // Actualizar indicio
    async actualizarIndicio(id_indicio, data) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_indicio', sql.Int, id_indicio)
                .input('descripcion', sql.Text, data.descripcion)
                .input('color', sql.VarChar(50), data.color || null)
                .input('tamano', sql.VarChar(100), data.tamano || null)
                .input('peso', sql.Decimal(10, 2), data.peso || null)
                .input('unidad_peso', sql.VarChar(20), data.unidad_peso || null)
                .input('ubicacion_hallazgo', sql.VarChar(200), data.ubicacion_hallazgo || null)
                .input('observaciones', sql.Text, data.observaciones || null)
                .input('id_usuario_actualiza', sql.Int, data.id_usuario_actualiza)
                .execute('sp_ActualizarIndicio');

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al actualizar indicio:', error);
            throw error;
        }
    }

    // Eliminar indicio (soft delete)
    async eliminarIndicio(id_indicio, id_usuario) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_indicio', sql.Int, id_indicio)
                .input('id_usuario', sql.Int, id_usuario)
                .execute('sp_EliminarIndicio');

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al eliminar indicio:', error);
            throw error;
        }
    }

    // Obtener tipos de indicio
    async obtenerTiposIndicio() {
        try {
            const pool = await getConnection();
            const result = await pool.request().execute('sp_ObtenerTiposIndicio');
            return result.recordset;
        } catch (error) {
            Logger.error('Error al obtener tipos de indicio:', error);
            throw error;
        }
    }
}

module.exports = new IndicioService();