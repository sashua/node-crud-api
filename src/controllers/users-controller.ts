// ****************************************************************
// * /api/users Route controller
// ****************************************************************

import type { Middleware } from '../lib/api-server.js';
import type { User, UserDto, UsersService } from '../services/users-service.js';

export class UsersController {
  constructor(private usersService: UsersService) {}

  getAll: Middleware = async (_, res) => {
    const users = await this.usersService.getAll();
    res.writeHead(200).end(JSON.stringify(users));
  };

  getById: Middleware = async (req, res) => {
    const id = req.params?.id as User['id'];
    const user = await this.usersService.getById(id);
    if (user) {
      res.writeHead(200).end(JSON.stringify(user));
    } else {
      res.writeHead(404).end(JSON.stringify({ message: "User doesn't exist" }));
    }
  };

  create: Middleware = async (req, res) => {
    const dto = req.body as UserDto;
    const user = await this.usersService.create(dto);
    res.writeHead(201).end(JSON.stringify(user));
  };

  update: Middleware = async (req, res) => {
    const id = req.params?.id as User['id'];
    const dto = req.body as UserDto;
    const user = await this.usersService.update(id, dto);
    if (user) {
      res.writeHead(200).end(JSON.stringify(user));
    } else {
      res.writeHead(404).end(JSON.stringify({ message: "User doesn't exist" }));
    }
  };

  delete: Middleware = async (req, res) => {
    const id = req.params?.id as User['id'];
    const user = await this.usersService.remove(id);
    if (user) {
      res.writeHead(204).end();
    } else {
      res.writeHead(404).end(JSON.stringify({ message: "User doesn't exist" }));
    }
  };
}
