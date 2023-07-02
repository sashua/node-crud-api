import dotenv from 'dotenv';
import request from 'supertest';
import { ApiServer } from '../lib/api-server.js';
import { User, UsersService } from '../services/users-service.js';
import { startServer } from '../start-server.js';

dotenv.config();
const PORT = Number.parseInt(process.env.PORT ?? '3000');

const createUserDtoList = [
  { username: 'Homer', age: 36, hobbies: ['beer', 'watching tv'] },
  { username: 'Marge', age: 34, hobbies: ['housework'] },
  { username: 'Bart', age: 10, hobbies: ['skateboarding'] },
  { username: 'Lisa', age: 8, hobbies: ['playing saxophone'] },
  { username: 'Maggie', age: 1, hobbies: [] },
];

describe('Test CRUD with multiple records', () => {
  const api = request(`http://localhost:${PORT}/api`);
  let server: ApiServer;
  let createdUserList: User[];

  beforeAll(() => {
    createdUserList = [];
    server = startServer(PORT, new UsersService());
  });

  afterAll(() => {
    server.close();
  });

  it('Should get empty records array', async () => {
    await api.get('/users').expect(200).expect([]);
  });

  it('Should create multiple users', async () => {
    for (const createUserDto of createUserDtoList) {
      const res = await api
        .post('/users')
        .set('Content-Type', 'application/json')
        .send(createUserDto)
        .expect(201);
      expect(res.body).toMatchObject(createUserDto);
      expect(res.body).toHaveProperty('id');
      createdUserList.push(res.body);
    }
  });

  it('Should get all created users', async () => {
    const res = await api.get(`/users`).expect(200);
    expect(res.body).toMatchObject(createdUserList);
  });

  it('Should delete multiple users', async () => {
    await Promise.all(createdUserList.map((user) => api.delete(`/users/${user.id}`).expect(204)));
    await api.get('/users').expect(200).expect([]);
  });
});
