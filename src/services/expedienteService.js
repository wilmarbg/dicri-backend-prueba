const { getConnection, sql } = require('../config/database');
const Logger = require('../utils/logger');

class ExpedienteService {
    // Crear expediente
    async crearExpediente(data) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('numero_expediente', sql.VarChar(50), data.numero_expediente)
                .input('titulo', sql.VarChar(200), data.titulo)
                .input('descripcion', sql.Text, data.descripcion || null)
                .input('id_tecnico_registra', sql.Int, data.id_tecnico_registra)
                .execute('sp_InsertarExpediente');

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al crear expediente:', error);
            throw error;
        }
    }

    // Obtener expedientes con filtros
    async obtenerExpedientes(filtros = {}) {
        try {
            const pool = await getConnection();
            const request = pool.request();

            if (filtros.id_estado) {
                request.input('id_estado', sql.Int, filtros.id_estado);
            } else {
                request.input('id_estado', sql.Int, null);
            }

            if (filtros.fecha_inicio) {
                request.input('fecha_inicio', sql.Date, filtros.fecha_inicio);
            } else {
                request.input('fecha_inicio', sql.Date, null);
            }

            if (filtros.fecha_fin) {
                request.input('fecha_fin', sql.Date, filtros.fecha_fin);
            } else {
                request.input('fecha_fin', sql.Date, null);
            }

            if (filtros.id_tecnico) {
                request.input('id_tecnico', sql.Int, filtros.id_tecnico);
            } else {
                request.input('id_tecnico', sql.Int, null);
            }

            const result = await request.execute('sp_ObtenerExpedientes');
            return result.recordset;
        } catch (error) {
            Logger.error('Error al obtener expedientes:', error);
            throw error;
        }
    }

    // Obtener expediente por ID
    async obtenerExpedientePorId(id_expediente) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_expediente', sql.Int, id_expediente)
                .execute('sp_ObtenerExpedientePorId');

            if (result.recordset.length === 0) {
                throw new Error('Expediente no encontrado');
            }

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al obtener expediente:', error);
            throw error;
        }
    }

    // Enviar expediente a revisión
    async enviarARevision(id_expediente, id_tecnico) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_expediente', sql.Int, id_expediente)
                .input('id_tecnico', sql.Int, id_tecnico)
                .execute('sp_EnviarExpedienteARevision');

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al enviar expediente a revisión:', error);
            throw error;
        }
    }

    // Revisar expediente Aprobar y Rechazar
    async revisarExpediente(data) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('id_expediente', sql.Int, data.id_expediente)
                .input('id_coordinador', sql.Int, data.id_coordinador)
                .input('accion', sql.VarChar(20), data.accion)
                .input('justificacion', sql.Text, data.justificacion || null)
                .execute('sp_RevisarExpediente');

            return result.recordset[0];
        } catch (error) {
            Logger.error('Error al revisar expediente:', error);
            throw error;
        }
    }

    // Obtener estadísticas
    async obtenerEstadisticas() {
        try {
            const pool = await getConnection();
            const result = await pool.request().execute('sp_ObtenerEstadisticas');
            const stats = {};
            result.recordset.forEach(row => {
                stats[row.metrica] = row.valor;
            });

            return stats;
        } catch (error) {
            Logger.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    // Obtener estados de expediente
    async obtenerEstados() {
        try {
            const pool = await getConnection();
            const result = await pool.request().execute('sp_ObtenerEstadosExpediente');
            return result.recordset;
        } catch (error) {
            Logger.error('Error al obtener estados:', error);
            throw error;
        }
    }

    // Generar reporte
    async generarReporte(filtros = {}) {
        try {
            const pool = await getConnection();
            const request = pool.request();

            request.input('fecha_inicio', sql.Date, filtros.fecha_inicio || null);
            request.input('fecha_fin', sql.Date, filtros.fecha_fin || null);
            request.input('id_estado', sql.Int, filtros.id_estado || null);

            const result = await request.execute('sp_GenerarReporteExpedientes');
            return result.recordset;
        } catch (error) {
            Logger.error('Error al generar reporte:', error);
            throw error;
        }
    }
}

module.exports = new ExpedienteService();