import type { UsersService } from '../services/users-service.js';
import type { Middleware, User, UserDto } from '../types.js';

export class UsersController {
  constructor(private usersService: UsersService) {}

  getAll: Middleware = (_, res) => {
    const users = this.usersService.getAll();
    res.writeHead(200).end(JSON.stringify(users));
  };

  getById: Middleware = (req, res) => {
    const id = req.params?.id as User['id'];
    const user = this.usersService.getById(id);
    if (user) {
      res.writeHead(200).end(JSON.stringify(user));
    } else {
      res.writeHead(404).end(JSON.stringify({ message: "User doesn't exist" }));
    }
  };

  create: Middleware = (req, res) => {
    const dto = req.body as UserDto;
    const user = this.usersService.create(dto);
    res.writeHead(201).end(JSON.stringify(user));
  };

  update: Middleware = (req, res) => {
    const id = req.params?.id as User['id'];
    const dto = req.body as UserDto;
    const user = this.usersService.update(id, dto);
    if (user) {
      res.writeHead(200).end(JSON.stringify(user));
    } else {
      res.writeHead(404).end(JSON.stringify({ message: "User doesn't exist" }));
    }
  };

  delete: Middleware = (req, res) => {
    const id = req.params?.id as User['id'];
    const user = this.usersService.remove(id);
    if (user) {
      res.writeHead(204).end();
    } else {
      res.writeHead(404).end(JSON.stringify({ message: "User doesn't exist" }));
    }
  };
}
