import dotenv from 'dotenv';
import { UsersController } from './controllers/users-controller.js';
import { parseBody } from './middlewares/parse-body.js';
import { validateId } from './middlewares/validate-id.js';
import { validateUserDto } from './middlewares/validate-user-dto.js';
import { ApiServer } from './server/api-server.js';
import { UsersService } from './services/users-service.js';

dotenv.config();
const PORT = Number.parseInt(process.env.PORT ?? '3000');

const usersService = new UsersService();
const usersController = new UsersController(usersService);
const app = new ApiServer();

app.use('GET', '/api/users', usersController.getAll);
app.use('GET', '/api/users/:id', validateId, usersController.getById);
app.use('POST', '/api/users', parseBody, validateUserDto, usersController.create);
app.use('PUT', '/api/users/:id', parseBody, validateId, validateUserDto, usersController.update);
app.use('DELETE', '/api/users/:id', validateId, usersController.delete);

app.listen(PORT, () => console.log('🚧 Server is running on port', PORT));
