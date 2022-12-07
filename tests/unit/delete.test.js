const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {
  test('authenticated users post, get, delete, then get, then delete once more', async () => {
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
    expect(res.get('location')).toBe(
      'http://localhost:8080/v1/fragments' + '/' + res.body.fragment.id
    );

    const res2 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.text).toStrictEqual(mystring);
    expect(res2.get('Content-Type')).toBe('text/plain');
    expect(res2.get('Content-Length')).toBe('13');

    const res3 = await request(app)
      .delete('/v1/fragments/' + res.body.fragment.id)
      .auth('user1@email.com', 'password1');

    expect(res3.statusCode).toBe(200);

    const res4 = await request(app)
      .get('/v1/fragments/' + res.body.fragment.id)
      .auth('user1@email.com', 'password1');

    expect(res4.statusCode).toBe(404);

    const res5 = await request(app)
      .delete('/v1/fragments/' + res.body.fragment.id)
      .auth('user1@email.com', 'password1');

    expect(res5.statusCode).toBe(500);
  });
});
