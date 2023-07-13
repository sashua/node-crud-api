import dotenv from 'dotenv';
import request from 'supertest';
import { ApiServer } from '../lib/api-server.js';
import { User, UsersService } from '../services/users-service.js';
import { startServer } from '../start-server.js';

dotenv.config();
const PORT = Number.parseInt(process.env.PORT ?? '3000');

const createUserDto = { username: 'Homer', age: 36, hobbies: ['watching tv'] };
const updateUserDto = { ...createUserDto, hobbies: ['beer', 'watching tv'] };

describe('Test CRUD with a single user record', () => {
  const api = request(`http://localhost:${PORT}/api`);
  let server: ApiServer;
  let createdUser: User;

  beforeAll(() => {
    server = startServer(PORT, new UsersService());
  });

  afterAll(() => {
    server.close();
  });

  it('Should get all records (empty array)', async () => {
    await api.get('/users').expect(200).expect([]);
  });

  it('Should create a new user', async () => {
    const res = await api
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(createUserDto)
      .expect(201);
    expect(res.body).toMatchObject(createUserDto);
    expect(res.body).toHaveProperty('id');
    createdUser = res.body;
  });

  it('Should get the created user', async () => {
    const res = await api.get(`/users/${createdUser.id}`).expect(200);
    expect(res.body).toMatchObject(createdUser);
  });

  it('Should update user details', async () => {
    const res = await api
      .put(`/users/${createdUser.id}`)
      .set('Content-Type', 'application/json')
      .send(updateUserDto)
      .expect(200);
    expect(res.body).toMatchObject({ ...updateUserDto, id: createdUser.id });
  });

  it('Should delete user', async () => {
    await api.delete(`/users/${createdUser.id}`).expect(204);
  });

  it('Should return 404 because the user has been deleted already', async () => {
    await api.get(`/users/${createdUser.id}`).expect(404);
  });
});
