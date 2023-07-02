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
    // calculate server ports due to available parallelism
    const totalWorkers = os.availableParallelism() - 1;
    const proxyPorts = Array(totalWorkers)
      .fill(0)
      .map((_, i) => PORT + i + 1);

    // sreate shared UsersService instance
    const rpcUsersService = new RpcServer(new UsersService());

    // spawn worker threads
    proxyPorts.forEach((port) => {
      const worker = cluster.fork({ PORT: port });
      rpcUsersService.listen(worker);
    });

    // start load balancer
    new ProxyServer(proxyPorts).listen(PORT, () =>
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
