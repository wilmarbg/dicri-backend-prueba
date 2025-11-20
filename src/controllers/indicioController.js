const indicioService = require('../services/indicioService');
const ResponseHandler = require('../utils/responseHandler');
const Logger = require('../utils/logger');

class IndicioController {
    // Crear indicio
    async crear(req, res, next) {
        try {
            const data = {
                ...req.body,
                id_tecnico_registra: req.user.id_usuario
            };

            const indicio = await indicioService.crearIndicio(data);

            Logger.info('Indicio creado', { 
                id_indicio: indicio.id_indicio,
                usuario: req.user.usuario 
            });

            return ResponseHandler.success(
                res,
                indicio,
                'Indicio creado exitosamente',
                201
            );
        } catch (error) {
            Logger.error('Error al crear indicio:', error);
            
            if (error.message.includes('no está en un estado')) {
                return ResponseHandler.error(res, error.message, 400);
            }

            next(error);
        }
    }

    // Obtener indicios por expediente
    async obtenerPorExpediente(req, res, next) {
        try {
            const { id_expediente } = req.params;
            const indicios = await indicioService.obtenerIndiciosPorExpediente(parseInt(id_expediente));

            return ResponseHandler.success(
                res,
                indicios,
                'Indicios obtenidos exitosamente'
            );
        } catch (error) {
            Logger.error('Error al obtener indicios:', error);
            next(error);
        }
    }

    // Actualizar indicio
    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const data = {
                ...req.body,
                id_usuario_actualiza: req.user.id_usuario
            };

            const resultado = await indicioService.actualizarIndicio(parseInt(id), data);

            Logger.info('Indicio actualizado', { 
                id_indicio: id,
                usuario: req.user.usuario 
            });

            return ResponseHandler.success(
                res,
                resultado,
                'Indicio actualizado exitosamente'
            );
        } catch (error) {
            Logger.error('Error al actualizar indicio:', error);
            next(error);
        }
    }

    // Eliminar indicio
    async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await indicioService.eliminarIndicio(
                parseInt(id),
                req.user.id_usuario
            );

            Logger.info('Indicio eliminado', { 
                id_indicio: id,
                usuario: req.user.usuario 
            });

            return ResponseHandler.success(
                res,
                resultado,
                'Indicio eliminado exitosamente'
            );
        } catch (error) {
            Logger.error('Error al eliminar indicio:', error);
            next(error);
        }
    }

    // Obtener tipos de indicio
    async obtenerTipos(req, res, next) {
        try {
            const tipos = await indicioService.obtenerTiposIndicio();

            return ResponseHandler.success(
                res,
                tipos,
                'Tipos de indicio obtenidos exitosamente'
            );
        } catch (error) {
            Logger.error('Error al obtener tipos de indicio:', error);
            next(error);
        }
    }
}

module.exports = new IndicioController();