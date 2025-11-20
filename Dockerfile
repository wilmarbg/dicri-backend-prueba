# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app
# Copiar archivos de dependencias
COPY package*.json ./
# Instalar dependencias (npm ci es más rápido y estricto que npm install)
RUN npm ci --only=production

# Etapa de producción
FROM node:18-alpine
WORKDIR /app

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar dependencias desde builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar código fuente
COPY --chown=nodejs:nodejs . .

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Healthcheck (Usa la ruta /health para verificar que Docker no se trabe)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "src/index.js"]