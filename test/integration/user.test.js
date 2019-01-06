const request = require('supertest');
const api = require('../../src');

/* global describe test expect */
describe('GET /users', () => {
  test('should respond with users', async() => {
    const app = api();
    const res = await request(app.listen())
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toEqual(['tobi', 'loki', 'jane']);
  });

  test('should respond with users/:id', async() => {
    const app = api();
    const res = await request(app.listen())
      .get('/users/jane')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toEqual(['name', 'age', 'species']);
  });
});
