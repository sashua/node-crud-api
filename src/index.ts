import cluster from 'cluster';
import dotenv from 'dotenv';
import os from 'os';
import { ProxyServer } from './lib/proxy-server.js';
import { RpcProxyHandler, RpcServer } from './lib/rpc.js';
import { UsersService } from './services/users-service.js';
import { startServer } from './start-server.js';

// read ENV variables
dotenv.config();
const MULTI = Boolean(process.env.MULTI);
const PORT = Number.parseInt(process.env.PORT ?? '3000');

if (MULTI) {
  if (cluster.isPrimary) {
    // calculate worker ports given the available parallelism
    const workerPorts = Array(os.availableParallelism() - 1)
      .fill(0)
      .map((_, i) => PORT + i + 1);

    // create shared UsersService instance
    const rpcUsersService = new RpcServer(new UsersService());

    // spawn worker threads
    workerPorts.forEach((port) => {
      const worker = cluster.fork({ PORT: port });
      rpcUsersService.listen(worker);
    });

    // start load balancer
    new ProxyServer(workerPorts).listen(PORT, () =>
      console.log(`Load balancer (PID: ${process.pid}) is running on port: ${PORT}`)
    );
  } else {
    // start worker instance of API server
    const usersService = new Proxy(new UsersService(), new RpcProxyHandler());
    startServer(PORT, usersService);
  }
} else {
  // start single instance of API server
  startServer(PORT, new UsersService());
}
