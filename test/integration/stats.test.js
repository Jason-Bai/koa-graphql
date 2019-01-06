const request = require('supertest');
const api = require('../../src');

/* global describe test expect  */
describe('GET /stats', () => {
  test('should respond with stats', async() => {
    const app = api();
    const res = await request(app.listen())
      .get('/stats')
      .expect('Content-Type', /json/)
      .expect(200);

    const expected = {
      requests: 100000,
      average_duration: 52,
      uptime: 123123132
    };

    expect(res.body).toEqual(expected);
  });
});

describe('GET /stats/:name', () => {
  test('should respond with a single stat', async() => {
    const app = api();
    const res = await request(app.listen())
      .get('/stats/requests');

    const expected = 100000;

    expect(res.body).toEqual(expected);
  });
});
