// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('correct credentials are not denied', () =>
    request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .expect(201));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users post and get a response of some sort', async () => {
    let mystring = 'Testing Stuff';
    const res = await request(app)
      .post('/v1/fragments')
      .send(mystring)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(13);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
  });

  test('authenticated users post and get a response of some sort but buffer', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send(Buffer.from([1, 2, 3]))
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(3);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
  });

  test('authenticated users post and get a response of some sort but nothing', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send()
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(0);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
  });

  test('authenticated users post and get a response of some sort but JSON', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send({ Valid: 'JSON' })
      .set('Content-Type', 'application/json')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.body.fragment.size).toBe(16);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
  });

  test('authenticated users post and get a response of some sort but empty JSON', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send()
      .set('Content-Type', 'application/json')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(500);
  });

  test('authenticated users post and get a response of some sort but empty HTML', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send()
      .set('Content-Type', 'text/html')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/html');
    expect(res.body.fragment.size).toBe(0);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
  });
});
