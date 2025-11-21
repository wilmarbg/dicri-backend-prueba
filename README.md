# API DICRI - Sistema de Gestión de Evidencias

API RESTful para el Sistema de Gestión de Evidencias del Ministerio Público de Guatemala.

## 🚀 Tecnologías

- Node.js 18+
- Express.js
- SQL Server (Azure)
- Docker
- JWT para autenticación
- Swagger para documentación

## 📦 Instalación

### Desarrollo Local
```bash
# Clonar repositorio
git clone https://github.com/wilmarbg/dicri-backend-prueba.git
cd dicri-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en modo desarrollo
npm run dev
```
## 📚 Documentación API

Una vez iniciado el servidor, accede a:

- Swagger UI: `http://localhost:3000/api/docs`

## 🔐 Autenticación

Todas las rutas (excepto `/api/auth/login`) requieren un token JWT en el header:
````
Authorization: Bearer <tu-token-jwt>