// ****************************************************************
// * In-memory Users storage
// ****************************************************************

import { v4 as randomUuid } from 'uuid';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};
export type UserDto = Omit<User, 'id'>;

export class UsersService {
  private users: User[] = [];

  getAll = async () => {
    return this.users;
  };

  getById = async (id: User['id']) => {
    return this.users.find((user) => user.id === id);
  };

  create = async (userDto: UserDto) => {
    this.users.push({ id: randomUuid(), ...userDto });
    return this.users.at(-1);
  };

  update = async (id: User['id'], userDto: UserDto) => {
    const foundIndex = this.users.findIndex((user) => user.id === id);
    if (foundIndex === -1) return;
    this.users[foundIndex] = { ...this.users[foundIndex], ...userDto };
    return this.users[foundIndex];
  };

  remove = async (id: User['id']) => {
    const foundIndex = this.users.findIndex((user) => user.id === id);
    if (foundIndex === -1) return;
    return this.users.splice(foundIndex, 1)[0];
  };
}
