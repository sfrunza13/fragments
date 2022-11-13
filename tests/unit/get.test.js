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

  test('authenticated users on unfound route', async () => {
    const res = await request(app).get('///').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('authenticated users post and get without id', async () => {
    let mystring = 'Stuff tester';
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
    expect(res.body.fragment.size).toBe(12);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(Array.isArray(res2.body.fragments)).toBe(true);
    expect(res2.body.fragments[0]).toEqual(res.body.fragment.id);
    expect(res2.body.fragments.length).toStrictEqual(1);
  });
});

describe('GET v1/fragments/?expand=1', () => {
  test('authenticated users post and get with expand', async () => {
    let mystring = 'Stuff tester the sequel';
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
    expect(res.body.fragment.size).toBe(23);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(Array.isArray(res2.body.fragments)).toBe(true);
    expect(res2.body.fragments[1]).toEqual(res.body.fragment);
    expect(res2.body.fragments.length).toStrictEqual(2);
  });
});

describe('GET v1/fragments/:id', () => {
  test('authenticated users post and get with id', async () => {
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
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.text).toStrictEqual(mystring);
    expect(res2.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(res2.get('Content-Length')).toBe('13');
  });

  test('authenticated users post and get with bad id', async () => {
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
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/9926be67-fae9-433d-86ef-7caa333af177a')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(500);
  });

  test('authenticated users post and get converting markdown to HTML', async () => {
    let mystring = '# Testing Stuff';
    const res = await request(app)
      .post('/v1/fragments')
      .send(mystring)
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/markdown');
    expect(res.body.fragment.size).toBe(15);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id + '.html')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.text) === '<h1>Testing Stuff</h1>';
    expect(res2.get('Content-Type')).toBe('text/html; charset=utf-8');
    expect(res2.get('Content-Length')).toBe('23');
  });

  test('authenticated users post and get converting markdown to json', async () => {
    let mystring = '# Testing Stuff';
    const res = await request(app)
      .post('/v1/fragments')
      .send(mystring)
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/markdown');
    expect(res.body.fragment.size).toBe(15);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id + '.json')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(500);
  });

  test('authenticated users post and get converting markdown to unconvertable', async () => {
    let mystring = '# Testing Stuff';
    const res = await request(app)
      .post('/v1/fragments')
      .send(mystring)
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/markdown');
    expect(res.body.fragment.size).toBe(15);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id + '.random')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(500);
  });

  test('authenticated users post and get converting markdown to txt', async () => {
    let mystring = '# Testing Stuff';
    const res = await request(app)
      .post('/v1/fragments')
      .send(mystring)
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/markdown');
    expect(res.body.fragment.size).toBe(15);
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id + '.txt')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.text).toEqual(mystring);
  });
});

describe('GET v1/fragments/:id/info', () => {
  test('authenticated users post and get with id to info', async () => {
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
    expect(res.get('location')).toBe('http://localhost:8080/v1/fragments');

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id + '/info')
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(JSON.parse(res2.text).fragment).toEqual(res.body.fragment);
  });

  test('authenticated users get with wrong id to info', async () => {
    const res2 = await request(app)
      .get('/v1/fragments/f3798eac-51ae-4970-b489-14ac32b3e33cy/info')
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(500);
  });
});
