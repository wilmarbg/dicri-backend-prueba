const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

const getConnection = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log('Conexión a Azure SQL Server establecida');
        }
        return pool;
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
};

const closeConnection = async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Conexión cerrada correctamente');
        }
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
        throw error;
    }
};

module.exports = {
    getConnection,
    closeConnection,
    sql
};