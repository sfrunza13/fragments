const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('authenticated users post and put plain text', async () => {
    let mystring = 'Testing Stuff';
    let updatedString = 'Updated String';
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
    expect(res.get('location')).toBe(
      'http://localhost:8080/v1/fragments' + '/' + res.body.fragment.id
    );

    const res2 = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .send(updatedString)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(201);
    expect(res2.body.status).toBe('ok');
    expect(res2.body.fragment).toHaveProperty('ownerId');
    expect(res2.body.fragment).toHaveProperty('id');
    expect(res2.body.fragment.type).toBe('text/plain');
    expect(res2.body.fragment.size).toBe(14);
    expect(res2.body.fragment).toHaveProperty('created');
    expect(res2.body.fragment.created).toEqual(res.body.fragment.created);
    expect(res2.body.fragment).toHaveProperty('updated');
    expect(res2.body.fragment.updated).not.toEqual(res.body.fragment.updated);
    expect(res2.get('location')).toBe(
      'http://localhost:8080/v1/fragments' + '/' + res.body.fragment.id
    );

    const res3 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res3.text).toStrictEqual(updatedString);
  });

  //next test
  test('authenticated users post and put to other content-type', async () => {
    let mystring = 'Testing Stuff';
    let updatedString = 'Updated String';
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
    expect(res.get('location')).toBe(
      'http://localhost:8080/v1/fragments' + '/' + res.body.fragment.id
    );

    const res2 = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .send(updatedString)
      .set('Content-Type', 'text/html')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(400);
  });

  test('authenticated users post and put to other unkown ID', async () => {
    let mystring = 'Testing Stuff';
    let updatedString = 'Updated String';
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
    expect(res.get('location')).toBe(
      'http://localhost:8080/v1/fragments' + '/' + res.body.fragment.id
    );

    const res2 = await request(app)
      .put(`/v1/fragments/${123451}`)
      .send(updatedString)
      .set('Content-Type', 'text/html')
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(404);
  });
});
