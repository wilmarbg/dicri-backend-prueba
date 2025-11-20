const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        app.listen(PORT, () => {
            console.log('PRUEBA DE ESCUCHA');
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

main();