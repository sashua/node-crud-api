import { v4 as randomUuid } from 'uuid';
import type { User, UserDto } from '../types.js';

export class UsersService {
  private users: User[] = [];

  getAll = () => {
    return this.users;
  };

  getById = (id: User['id']) => {
    return this.users.find((user) => user.id === id);
  };

  create = (userDto: UserDto) => {
    this.users.push({ id: randomUuid(), ...userDto });
    return this.users.at(-1);
  };

  update = (id: User['id'], userDto: UserDto) => {
    const foundIndex = this.users.findIndex((user) => user.id === id);
    if (foundIndex === -1) return;
    this.users[foundIndex] = { ...this.users[foundIndex], ...userDto };
    return this.users[foundIndex];
  };

  remove = (id: User['id']) => {
    const foundIndex = this.users.findIndex((user) => user.id === id);
    if (foundIndex === -1) return;
    return this.users.splice(foundIndex, 1)[0];
  };
}
