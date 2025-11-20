const request = require('supertest');
const app = require('../src/app');
const { sql } = require('../src/config/database');

describe('Auth Endpoints', () => {
    describe('POST /api/auth/login', () => {
        it('debería retornar error sin credenciales', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('debería retornar error con credenciales inválidas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    usuario: 'usuarioinexistente',
                    password: 'passwordincorrecto'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/verify', () => {
        it('debería retornar error sin token', async () => {
            const res = await request(app)
                .get('/api/auth/verify');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});

describe('Health Check', () => {
    it('GET /health debería retornar 200', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('OK');
    });
});

afterAll(async () => {
    await sql.close();
});