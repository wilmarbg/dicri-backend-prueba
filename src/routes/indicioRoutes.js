const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const indicioController = require('../controllers/indicioController');
const { verifyToken, isTecnico } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

// Validaciones
const crearIndicioValidation = [
    body('id_expediente')
        .isInt({ min: 1 }).withMessage('ID de expediente inválido'),
    body('codigo_indicio')
        .notEmpty().withMessage('El código de indicio es requerido')
        .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
    body('id_tipo_indicio')
        .isInt({ min: 1 }).withMessage('ID de tipo de indicio inválido'),
    body('descripcion')
        .notEmpty().withMessage('La descripción es requerida'),
    body('color')
        .optional()
        .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
    body('tamano')
        .optional()
        .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    body('peso')
        .optional()
        .isDecimal().withMessage('El peso debe ser un número decimal'),
    body('unidad_peso')
        .optional()
        .isLength({ max: 20 }).withMessage('Máximo 20 caracteres'),
    body('ubicacion_hallazgo')
        .optional()
        .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
    body('observaciones')
        .optional()
];

const actualizarIndicioValidation = [
    body('descripcion')
        .notEmpty().withMessage('La descripción es requerida'),
    body('color')
        .optional()
        .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
    body('tamano')
        .optional()
        .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    body('peso')
        .optional()
        .isDecimal().withMessage('El peso debe ser un número decimal'),
    body('unidad_peso')
        .optional()
        .isLength({ max: 20 }).withMessage('Máximo 20 caracteres'),
    body('ubicacion_hallazgo')
        .optional()
        .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
    body('observaciones')
        .optional()
];

const idParamValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID debe ser un número entero positivo')
];

const expedienteIdParamValidation = [
    param('id_expediente')
        .isInt({ min: 1 }).withMessage('ID de expediente debe ser un número entero positivo')
];

router.use(verifyToken);

// Obtener tipos de indicio (catálogo)
/**
 * @swagger
 * /api/indicios/tipos:
 *   get:
 *     summary: Obtener catálogo de tipos de indicio
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tipos de indicio obtenidos exitosamente
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
 *                           id_tipo_indicio:
 *                             type: integer
 *                             example: 1
 *                           nombre_tipo:
 *                             type: string
 *                             example: 'Arma Blanca'
 *                           descripcion:
 *                             type: string
 *                             example: 'Cuchillos, navajas, machetes, etc.'
 *       401:
 *         description: No autenticado
 */
router.get('/tipos',indicioController.obtenerTipos);

// Obtener indicios por expediente
/**
 * @swagger
 * /api/indicios/expediente/{id_expediente}:
 *   get:
 *     summary: Obtener todos los indicios de un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_expediente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *         example: 1
 *     responses:
 *       200:
 *         description: Indicios obtenidos exitosamente
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
 *                         $ref: '#/components/schemas/Indicio'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Expediente no encontrado
 */
router.get('/expediente/:id_expediente',expedienteIdParamValidation,validateRequest,indicioController.obtenerPorExpediente);

// Crear indicio (solo técnicos)
/**
 * @swagger
 * /api/indicios:
 *   post:
 *     summary: Crear un nuevo indicio
 *     description: Solo se pueden agregar indicios a expedientes en estado EN_REGISTRO o RECHAZADO
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearIndicio'
 *     responses:
 *       201:
 *         description: Indicio creado exitosamente
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
 *                         id_indicio:
 *                           type: integer
 *                           example: 1
 *                         codigo_indicio:
 *                           type: string
 *                           example: 'IND-001'
 *       400:
 *         description: Datos inválidos o expediente no permite agregar indicios
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere rol Técnico)
 *       404:
 *         description: Expediente no encontrado
 */
router.post('/',isTecnico,crearIndicioValidation,validateRequest,indicioController.crear);

// Actualizar indicio (solo técnicos)
/**
 * @swagger
 * /api/indicios/{id}:
 *   put:
 *     summary: Actualizar un indicio existente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del indicio
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: 'Cuchillo de cocina marca Tramontina'
 *               color:
 *                 type: string
 *                 example: 'Plateado con mango negro'
 *               tamano:
 *                 type: string
 *                 example: '25cm de largo total, hoja de 15cm'
 *               peso:
 *                 type: number
 *                 example: 0.3
 *               unidad_peso:
 *                 type: string
 *                 example: 'kg'
 *               ubicacion_hallazgo:
 *                 type: string
 *                 example: 'Cocina, segundo cajón del lado derecho'
 *               observaciones:
 *                 type: string
 *                 example: 'Presenta manchas rojizas en la hoja'
 *     responses:
 *       200:
 *         description: Indicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere rol Técnico)
 *       404:
 *         description: Indicio no encontrado
 */
router.put('/:id',isTecnico,idParamValidation,actualizarIndicioValidation,validateRequest,indicioController.actualizar);

// Eliminar indicio (solo técnicos)
/**
 * @swagger
 * /api/indicios/{id}:
 *   delete:
 *     summary: Eliminar un indicio (soft delete)
 *     description: El indicio no se elimina físicamente, solo se marca como inactivo
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del indicio
 *         example: 1
 *     responses:
 *       200:
 *         description: Indicio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere rol Técnico)
 *       404:
 *         description: Indicio no encontrado
 */
router.delete('/:id',isTecnico,idParamValidation,validateRequest,indicioController.eliminar);

module.exports = router;