const expedienteService = require('../services/expedienteService');
const ResponseHandler = require('../utils/responseHandler');
const Logger = require('../utils/logger');

class ExpedienteController {
    // Crear expediente
    async crear(req, res, next) {
        try {
            const data = {
                ...req.body,
                id_tecnico_registra: req.user.id_usuario
            };

            const expediente = await expedienteService.crearExpediente(data);

            Logger.info('Expediente creado', { 
                id_expediente: expediente.id_expediente,
                usuario: req.user.usuario 
            });

            return ResponseHandler.success(
                res,
                expediente,
                'Expediente creado exitosamente',
                201
            );
        } catch (error) {
            Logger.error('Error al crear expediente:', error);
            
            if (error.message.includes('ya existe')) {
                return ResponseHandler.error(
                    res,
                    'El número de expediente ya existe',
                    409
                );
            }

            next(error);
        }
    }

    // Obtener todos los expedientes con filtros
    async obtenerTodos(req, res, next) {
        try {
            const filtros = {
                id_estado: req.query.id_estado,
                fecha_inicio: req.query.fecha_inicio,
                fecha_fin: req.query.fecha_fin,
                id_tecnico: req.query.id_tecnico
            };

            const expedientes = await expedienteService.obtenerExpedientes(filtros);

            return ResponseHandler.success(
                res,
                expedientes,
                'Expedientes obtenidos exitosamente'
            );
        } catch (error) {
            Logger.error('Error al obtener expedientes:', error);
            next(error);
        }
    }

    // Obtener expediente por ID
    async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const expediente = await expedienteService.obtenerExpedientePorId(parseInt(id));

            return ResponseHandler.success(
                res,
                expediente,
                'Expediente obtenido exitosamente'
            );
        } catch (error) {
            Logger.error('Error al obtener expediente:', error);
            
            if (error.message === 'Expediente no encontrado') {
                return ResponseHandler.error(res, error.message, 404);
            }

            next(error);
        }
    }

    // Enviar a revisión
    async enviarARevision(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await expedienteService.enviarARevision(
                parseInt(id),
                req.user.id_usuario
            );

            Logger.info('Expediente enviado a revisión', { 
                id_expediente: id,
                usuario: req.user.usuario 
            });

            return ResponseHandler.success(
                res,
                resultado,
                'Expediente enviado a revisión exitosamente'
            );
        } catch (error) {
            Logger.error('Error al enviar expediente a revisión:', error);
            
            if (error.message.includes('al menos un indicio')) {
                return ResponseHandler.error(res, error.message, 400);
            }

            next(error);
        }
    }

    // Revisar expediente (Aprobar/Rechazar)
    async revisar(req, res, next) {
        try {
            const { id } = req.params;
            const { accion, justificacion } = req.body;

            const data = {
                id_expediente: parseInt(id),
                id_coordinador: req.user.id_usuario,
                accion,
                justificacion
            };

            const resultado = await expedienteService.revisarExpediente(data);

            Logger.info('Expediente revisado', { 
                id_expediente: id,
                accion,
                usuario: req.user.usuario 
            });

            return ResponseHandler.success(
                res,
                resultado,
                `Expediente ${accion.toLowerCase()} exitosamente`
            );
        } catch (error) {
            Logger.error('Error al revisar expediente:', error);
            
            if (error.message.includes('justificación')) {
                return ResponseHandler.error(res, error.message, 400);
            }

            next(error);
        }
    }

    // Obtener estadísticas
    async obtenerEstadisticas(req, res, next) {
        try {
            const estadisticas = await expedienteService.obtenerEstadisticas();

            return ResponseHandler.success(
                res,
                estadisticas,
                'Estadísticas obtenidas exitosamente'
            );
        } catch (error) {
            Logger.error('Error al obtener estadísticas:', error);
            next(error);
        }
    }

    // Obtener estados
    async obtenerEstados(req, res, next) {
        try {
            const estados = await expedienteService.obtenerEstados();

            return ResponseHandler.success(
                res,
                estados,
                'Estados obtenidos exitosamente'
            );
        } catch (error) {
            Logger.error('Error al obtener estados:', error);
            next(error);
        }
    }

    // Generar reporte
    async generarReporte(req, res, next) {
        try {
            const filtros = {
                fecha_inicio: req.query.fecha_inicio,
                fecha_fin: req.query.fecha_fin,
                id_estado: req.query.id_estado
            };

            const reporte = await expedienteService.generarReporte(filtros);

            return ResponseHandler.success(
                res,
                reporte,
                'Reporte generado exitosamente'
            );
        } catch (error) {
            Logger.error('Error al generar reporte:', error);
            next(error);
        }
    }
}

module.exports = new ExpedienteController();