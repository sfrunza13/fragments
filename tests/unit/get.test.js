// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
  test('authenticated users post and get with id', async () => {
    let mystring = 'Testing Stuff';
    const res = await request(app)
      .post('/v1/fragments')
      .send(mystring)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.Fragment).toHaveProperty('ownerId');
    expect(res.body.Fragment).toHaveProperty('id');
    expect(res.body.Fragment.type).toBe('text/plain');
    expect(res.body.Fragment.size).toBe(13);
    expect(res.body.Fragment).toHaveProperty('created');
    expect(res.body.Fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.Fragment.id)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.text).toStrictEqual(mystring);
    expect(res2.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(res2.get('Content-Length')).toBe('13');
  });

  test('authenticated users post and get without id', async () => {
    let mystring = 'Stuff tester the sequel';
    const res = await request(app)
      .post('/v1/fragments')
      .send(mystring)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.Fragment).toHaveProperty('ownerId');
    expect(res.body.Fragment).toHaveProperty('id');
    expect(res.body.Fragment.type).toBe('text/plain');
    expect(res.body.Fragment.size).toBe(23);
    expect(res.body.Fragment).toHaveProperty('created');
    expect(res.body.Fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(Array.isArray(res2.body.fragments)).toBe(true);
    expect(res2.body.fragments.length).toStrictEqual(2);
  });
});
