const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
    let accessToken;

    test('Should register new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Test123!@#',
                name: 'Test User'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('user');
    });

    test('Should login user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'Test123!@#'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        accessToken = response.body.accessToken;
    });

    test('Should access protected route with token', async () => {
        const response = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email');
    });

    test('Should reject access without token', async () => {
        const response = await request(app)
            .get('/api/users/profile');

        expect(response.status).toBe(401);
    });
});