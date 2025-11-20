const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const ResponseHandler = require('./utils/responseHandler');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSetup = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const expedienteRoutes = require('./routes/expedienteRoutes');
const indicioRoutes = require('./routes/indicioRoutes');

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}
app.use(cors(corsOptions));       
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

swaggerSetup(app);

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'API DICRI v1.0 - Bienvenido' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expedientes', expedienteRoutes);
app.use('/api/indicios', indicioRoutes);

app.use((req, res) => {
    ResponseHandler.error(
        res,
        `Ruta no encontrada: ${req.method} ${req.path}`,
        404
    );
});

app.use(errorHandler);

module.exports = app;