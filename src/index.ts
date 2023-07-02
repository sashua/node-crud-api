import dotenv from 'dotenv';
import { UsersService } from './services/users-service.js';
import { startCluster } from './start-cluster.js';
import { startServer } from './start-server.js';

dotenv.config();
const MULTI = Boolean(process.env.MULTI);
const PORT = Number.parseInt(process.env.PORT ?? '3000');

if (MULTI) {
  // start multi-threaded server with load balancing
  startCluster(PORT);
} else {
  // start single-threaded instance of API server
  startServer(PORT, new UsersService());
}
