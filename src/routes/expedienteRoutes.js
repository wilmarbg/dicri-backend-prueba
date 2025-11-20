const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

const expedienteController = require('../controllers/expedienteController');
const { verifyToken, isTecnico, isCoordinador } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

// Validaciones
const crearExpedienteValidation = [
    body('numero_expediente')
        .notEmpty().withMessage('El número de expediente es requerido')
        .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
    body('titulo')
        .notEmpty().withMessage('El título es requerido')
        .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
    body('descripcion')
        .optional()
];

const revisarExpedienteValidation = [
    body('accion')
        .notEmpty().withMessage('La acción es requerida').isIn(['APROBAR', 'RECHAZAR']).withMessage('Acción debe ser APROBAR o RECHAZAR'),
    body('justificacion')
        .if(body('accion').equals('RECHAZAR')).notEmpty().withMessage('La justificación es obligatoria para rechazar')
        ];
        const idParamValidation = [
        param('id').isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo')
        ];
        // Todas las rutas requieren autenticación
router.use(verifyToken);
// Rutas para técnicos y superiores
/**
 * @swagger
 * /api/expedientes:
 *   post:
 *     summary: Crear un nuevo expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearExpediente'
 *     responses:
 *       201:
 *         description: Expediente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id_expediente:
 *                           type: integer
 *                           example: 1
 *                         numero_expediente:
 *                           type: string
 *                           example: 'EXP-2024-001'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere rol Técnico)
 *       409:
 *         description: El número de expediente ya existe
 */
router.post('/',isTecnico,crearExpedienteValidation,validateRequest,expedienteController.crear);

/**
 * @swagger
 * /api/expedientes:
 *   get:
 *     summary: Obtener lista de expedientes con filtros opcionales
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_estado
 *         schema:
 *           type: integer
 *         description: Filtrar por estado (1=EN_REGISTRO, 2=EN_REVISION, 3=APROBADO, 4=RECHAZADO)
 *         example: 1
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango de búsqueda
 *         example: '2024-01-01'
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango de búsqueda
 *         example: '2024-12-31'
 *       - in: query
 *         name: id_tecnico
 *         schema:
 *           type: integer
 *         description: Filtrar por técnico que registró
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de expedientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Expediente'
 *       401:
 *         description: No autenticado
 */
router.get('/',expedienteController.obtenerTodos);

/**
 * @swagger
 * /api/expedientes/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de expedientes
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         total_expedientes:
 *                           type: integer
 *                           example: 150
 *                         en_registro:
 *                           type: integer
 *                           example: 25
 *                         en_revision:
 *                           type: integer
 *                           example: 10
 *                         aprobados:
 *                           type: integer
 *                           example: 100
 *                         rechazados:
 *                           type: integer
 *                           example: 15
 *       401:
 *         description: No autenticado
 */
router.get('/estadisticas',expedienteController.obtenerEstadisticas);

/**
 * @swagger
 * /api/expedientes/estados:
 *   get:
 *     summary: Obtener catálogo de estados de expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estados obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_estado:
 *                             type: integer
 *                             example: 1
 *                           nombre_estado:
 *                             type: string
 *                             example: 'EN_REGISTRO'
 *                           descripcion:
 *                             type: string
 *                             example: 'Expediente en proceso de registro'
 *       401:
 *         description: No autenticado
 */
router.get('/estados',expedienteController.obtenerEstados);

/**
 * @swagger
 * /api/expedientes/reporte:
 *   get:
 *     summary: Generar reporte de expedientes
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del reporte
 *         example: '2024-01-01'
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del reporte
 *         example: '2024-12-31'
 *       - in: query
 *         name: id_estado
 *         schema:
 *           type: integer
 *         description: Filtrar por estado
 *         example: 3
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           numero_expediente:
 *                             type: string
 *                           titulo:
 *                             type: string
 *                           fecha_registro:
 *                             type: string
 *                             format: date-time
 *                           nombre_estado:
 *                             type: string
 *                           tecnico:
 *                             type: string
 *                           coordinador:
 *                             type: string
 *                             nullable: true
 *                           fecha_revision:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           total_indicios:
 *                             type: integer
 *       401:
 *         description: No autenticado
 */
router.get('/reporte',expedienteController.generarReporte);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   get:
 *     summary: Obtener un expediente por ID
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *         example: 1
 *     responses:
 *       200:
 *         description: Expediente obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Expediente'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Expediente no encontrado
 */
router.get('/:id',idParamValidation,validateRequest,expedienteController.obtenerPorId);

/**
 * @swagger
 * /api/expedientes/{id}/enviar-revision:
 *   post:
 *     summary: Enviar expediente a revisión
 *     description: El técnico envía el expediente para que un coordinador lo revise. El expediente debe tener al menos un indicio registrado.
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *         example: 1
 *     responses:
 *       200:
 *         description: Expediente enviado a revisión exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: El expediente no cumple requisitos (ej. sin indicios)
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere rol Técnico)
 *       404:
 *         description: Expediente no encontrado
 */
router.post('/:id/enviar-revision',isTecnico,idParamValidation,validateRequest,expedienteController.enviarARevision);
// Rutas solo para coordinadores
/**
 * @swagger
 * /api/expedientes/{id}/revisar:
 *   post:
 *     summary: Revisar expediente (Aprobar o Rechazar)
 *     description: El coordinador aprueba o rechaza un expediente. Si rechaza, debe proporcionar justificación.
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RevisarExpediente'
 *           examples:
 *             aprobar:
 *               summary: Aprobar expediente
 *               value:
 *                 accion: 'APROBAR'
 *             rechazar:
 *               summary: Rechazar expediente
 *               value:
 *                 accion: 'RECHAZAR'
 *                 justificacion: 'Faltan detalles en la descripción del indicio 3. Por favor completar información de ubicación exacta.'
 *     responses:
 *       200:
 *         description: Expediente revisado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Datos inválidos (ej. falta justificación al rechazar)
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere rol Coordinador)
 *       404:
 *         description: Expediente no encontrado
 */
router.post( '/:id/revisar',isCoordinador,idParamValidation,revisarExpedienteValidation,validateRequest,expedienteController.revisar);

module.exports = router;