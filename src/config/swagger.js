const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API DICRI - Sistema de Gestión de Evidencias',
            version: '1.0.0',
            description: 'API RESTful para el Sistema de Gestión de Evidencias del Ministerio Público de Guatemala',
            contact: {
                name: 'Equipo de Desarrollo CSII',
                email: 'soporte@mp.gob.gt'
            },
            license: {
                name: 'Uso Interno',
                url: 'https://mp.gob.gt'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desarrollo'
            },
            {
                url: 'https://api-dicri.mp.gob.gt',
                description: 'Servidor de Producción'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingrese el token JWT obtenido del endpoint /api/auth/login'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error en la operación'
                        },
                        errors: {
                            type: 'object',
                            nullable: true
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operación exitosa'
                        },
                        data: {
                            type: 'object',
                            nullable: true
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['usuario', 'password'],
                    properties: {
                        usuario: {
                            type: 'string',
                            example: 'jtecnico',
                            minLength: 3
                        },
                        password: {
                            type: 'string',
                            example: 'password123',
                            minLength: 6
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        },
                        user: {
                            type: 'object',
                            properties: {
                                id_usuario: { type: 'integer', example: 1 },
                                nombre_completo: { type: 'string', example: 'Juan Técnico' },
                                usuario: { type: 'string', example: 'jtecnico' },
                                email: { type: 'string', example: 'jtecnico@mp.gob.gt' },
                                id_rol: { type: 'integer', example: 2 },
                                nombre_rol: { type: 'string', example: 'Técnico' },
                                activo: { type: 'boolean', example: true }
                            }
                        }
                    }
                },
                Expediente: {
                    type: 'object',
                    properties: {
                        id_expediente: { type: 'integer', example: 1 },
                        numero_expediente: { type: 'string', example: 'EXP-2024-001' },
                        titulo: { type: 'string', example: 'Caso de Robo Agravado' },
                        descripcion: { type: 'string', example: 'Descripción detallada del caso' },
                        fecha_registro: { type: 'string', format: 'date-time' },
                        fecha_actualizacion: { type: 'string', format: 'date-time', nullable: true },
                        id_estado: { type: 'integer', example: 1 },
                        nombre_estado: { type: 'string', example: 'EN_REGISTRO' },
                        id_tecnico_registra: { type: 'integer', example: 1 },
                        tecnico_registra: { type: 'string', example: 'Juan Técnico' },
                        id_coordinador_revisa: { type: 'integer', nullable: true },
                        coordinador_revisa: { type: 'string', nullable: true },
                        fecha_revision: { type: 'string', format: 'date-time', nullable: true },
                        justificacion_rechazo: { type: 'string', nullable: true },
                        total_indicios: { type: 'integer', example: 5 }
                    }
                },
                CrearExpediente: {
                    type: 'object',
                    required: ['numero_expediente', 'titulo'],
                    properties: {
                        numero_expediente: { type: 'string', example: 'EXP-2024-001' },
                        titulo: { type: 'string', example: 'Caso de Robo Agravado' },
                        descripcion: { type: 'string', example: 'Descripción detallada del caso' }
                    }
                },
                Indicio: {
                    type: 'object',
                    properties: {
                        id_indicio: { type: 'integer', example: 1 },
                        codigo_indicio: { type: 'string', example: 'IND-001' },
                        id_tipo_indicio: { type: 'integer', example: 1 },
                        tipo_indicio: { type: 'string', example: 'Arma Blanca' },
                        descripcion: { type: 'string', example: 'Cuchillo de cocina' },
                        color: { type: 'string', example: 'Plateado', nullable: true },
                        tamano: { type: 'string', example: '20cm de largo', nullable: true },
                        peso: { type: 'number', example: 0.25, nullable: true },
                        unidad_peso: { type: 'string', example: 'kg', nullable: true },
                        ubicacion_hallazgo: { type: 'string', example: 'Cocina, tercer cajón', nullable: true },
                        fecha_registro: { type: 'string', format: 'date-time' },
                        id_tecnico_registra: { type: 'integer', example: 1 },
                        tecnico_registra: { type: 'string', example: 'Juan Técnico' },
                        observaciones: { type: 'string', nullable: true }
                    }
                },
                CrearIndicio: {
                    type: 'object',
                    required: ['id_expediente', 'codigo_indicio', 'id_tipo_indicio', 'descripcion'],
                    properties: {
                        id_expediente: { type: 'integer', example: 1 },
                        codigo_indicio: { type: 'string', example: 'IND-001' },
                        id_tipo_indicio: { type: 'integer', example: 1 },
                        descripcion: { type: 'string', example: 'Cuchillo de cocina' },
                        color: { type: 'string', example: 'Plateado' },
                        tamano: { type: 'string', example: '20cm de largo' },
                        peso: { type: 'number', example: 0.25 },
                        unidad_peso: { type: 'string', example: 'kg' },
                        ubicacion_hallazgo: { type: 'string', example: 'Cocina, tercer cajón' },
                        observaciones: { type: 'string', example: 'Sin huellas visibles' }
                    }
                },
                RevisarExpediente: {
                    type: 'object',
                    required: ['accion'],
                    properties: {
                        accion: {
                            type: 'string',
                            enum: ['APROBAR', 'RECHAZAR'],
                            example: 'APROBAR'
                        },
                        justificacion: {
                            type: 'string',
                            example: 'Faltan detalles en la descripción del indicio 3',
                            description: 'Obligatorio si accion es RECHAZAR'
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'API DICRI - Documentación'
    }));
};

module.exports = swaggerSetup;