import { UsersController } from './controllers/users-controller.js';
import { ApiServer } from './lib/api-server.js';
import { logger } from './middlewares/logger.js';
import { parseBody } from './middlewares/parse-body.js';
import { validateId } from './middlewares/validate-id.js';
import { validateUserDto } from './middlewares/validate-user-dto.js';
import { UsersService } from './services/users-service.js';

// ----------------------------------------------------------------
// Starts ApiServer instance
//
export const startServer = (port: number, usersService: UsersService) => {
  const usersController = new UsersController(usersService);
  const api = new ApiServer();

  api.use('*', /.*/, logger(`PID: ${process.pid}, PORT: ${port}`));
  api.use('GET', '/api/users', usersController.getAll);
  api.use('GET', '/api/users/:id', validateId, usersController.getById);
  api.use('POST', '/api/users', parseBody, validateUserDto, usersController.create);
  api.use('PUT', '/api/users/:id', validateId, parseBody, validateUserDto, usersController.update);
  api.use('DELETE', '/api/users/:id', validateId, usersController.delete);

  api.listen(port, () =>
    console.log(`API server (PID: ${process.pid}) is running on port: ${port}`)
  );
  return api;
};
