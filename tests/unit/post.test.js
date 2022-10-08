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

    console.log(res);

    // .expect('Content-Type', /text/);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
