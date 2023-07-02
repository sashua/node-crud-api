// ****************************************************************
// * Load balancer (distributes incoming requests
// * using round-robin algorithm)
// ****************************************************************

import { IncomingMessage, Server, ServerResponse, createServer, request } from 'http';

export class ProxyServer {
  private server: Server;
  private portIndex = 0;

  constructor(private proxyPorts: number[]) {
    this.server = createServer(this.requestListener);
  }

  listen = (port: number, callback?: () => void) => {
    this.server.listen(port, callback);
  };

  close(callback?: () => void) {
    this.server.close(callback);
  }

  private requestListener = (req: IncomingMessage, res: ServerResponse) => {
    const proxyReq = request(
      {
        port: this.getNextPort(),
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        proxyRes
          .on('data', (chunk) => {
            if (!res.headersSent) {
              this.copyHeaders(proxyRes, res);
            }
            res.write(chunk);
          })
          .on('end', () => {
            if (!res.headersSent) {
              this.copyHeaders(proxyRes, res);
            }
            res.end();
          });
      }
    ).once('error', () =>
      res.writeHead(500).end(JSON.stringify({ message: 'Internal Server Error' }))
    );

    req.pipe(proxyReq);
  };

  private getNextPort = () => {
    const port = this.proxyPorts[this.portIndex];
    this.portIndex = ++this.portIndex % this.proxyPorts.length;
    return port;
  };

  private copyHeaders = (src: IncomingMessage, dest: ServerResponse) => {
    const { statusCode = 200, statusMessage, headers } = src;
    dest.writeHead(statusCode, statusMessage, headers);
  };
}
