// ****************************************************************
// * Load balancer (distributes incoming requests
// * using round-robin algorithm)
// ****************************************************************

import type { IncomingMessage, Server, ServerResponse } from 'http';
import { createServer, request } from 'http';

export class ProxyServer {
  private server: Server;
  private portIndex = 0;

  constructor(private proxyPorts: number[]) {
    this.server = createServer(this.requestListener);
  }

  listen = (port: number, callback?: () => void) => {
    this.server.listen(port, callback);
  };

  private requestListener = (req: IncomingMessage, res: ServerResponse) => {
    const proxyReq = request(
      {
        port: this.getNextPort(),
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        proxyRes.pipe(res);
      }
    ).on('error', () => res.writeHead(500).end('Internal Server Error'));
    req.pipe(proxyReq);
  };

  private getNextPort = () => {
    const port = this.proxyPorts[this.portIndex];
    this.portIndex = ++this.portIndex % this.proxyPorts.length;
    return port;
  };
}