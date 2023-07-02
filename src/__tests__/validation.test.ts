import dotenv from 'dotenv';
import request from 'supertest';
import { ApiServer } from '../lib/api-server.js';
import { UsersService } from '../services/users-service.js';
import { startServer } from '../start-server.js';

dotenv.config();
const PORT = Number.parseInt(process.env.PORT ?? '3000');

const userDto = { username: 'Homer', age: 36, hobbies: ['watching tv'] };

describe('Test id and UserDto validation', () => {
  const api = request(`http://localhost:${PORT}/api`);
  let server: ApiServer;

  beforeAll(() => {
    server = startServer(PORT, new UsersService());
  });

  afterAll(() => {
    server.close();
  });

  it('Should create a valid user', async () => {
    const res = await api
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(userDto)
      .expect(201);
    expect(res.body).toMatchObject(userDto);
    expect(res.body).toHaveProperty('id');
  });

  it('Should return 400 if user_id is not valid uuid', async () => {
    await api.get(`/users/123`).expect(400);
    await api.put(`/users/123`).set('Content-Type', 'application/json').send(userDto).expect(400);
    await api.delete(`/users/123`).expect(400);
  });

  it('Should return 400 if body is not valid UserDto', async () => {
    await api
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ ...userDto, username: '' })
      .expect(400);
    await api
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ ...userDto, age: -1 })
      .expect(400);
    await api
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ ...userDto, hobbies: [1, 2, 3] })
      .expect(400);
  });
});
