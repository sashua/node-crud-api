import cluster from 'cluster';
import os from 'os';
import { ProxyServer } from './lib/proxy-server.js';
import { RpcProxyHandler, RpcServer } from './lib/rpc.js';
import { UsersService } from './services/users-service.js';
import { startServer } from './start-server.js';

// ----------------------------------------------------------------
// Starts multi-threaded cluster
//
export const startCluster = (port: number) => {
  if (cluster.isPrimary) {
    // calculate worker ports given the available parallelism
    const workerPorts = Array(os.availableParallelism() - 1)
      .fill(0)
      .map((_, i) => port + i + 1);

    // start single server if only one thread is available
    if (!workerPorts.length) {
      startServer(port, new UsersService());
      return;
    }

    // create shared UsersService instance
    const rpcUsersService = new RpcServer(new UsersService());

    // spawn worker threads
    workerPorts.forEach((port) => {
      const worker = cluster.fork({ PORT: port });
      rpcUsersService.listen(worker);
    });

    // start load balancer
    new ProxyServer(workerPorts).listen(port, () =>
      console.log(`Load balancer (PID: ${process.pid}) is running on port: ${port}`)
    );
  } else {
    // start worker instance of API server
    const usersService = new Proxy(new UsersService(), new RpcProxyHandler());
    startServer(port, usersService);
  }
};
