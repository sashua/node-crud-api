// ****************************************************************
// * Load balancer (distributes incoming requests
// * using round-robin algorithm)
// ****************************************************************

import { IncomingMessage, Server, ServerResponse, request } from 'http';

export class ProxyServer extends Server {
  private portIndex = 0;

  // ----------------------------------------------------------------
  constructor(private proxyPorts: number[]) {
    // init server with requestListener
    super((req: IncomingMessage, res: ServerResponse) => {
      // forward incoming request to the next API server
      const proxyReq = request(
        {
          port: this.getNextPort(),
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (proxyRes) => {
          // pipe responce headers and body from API server
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

      // pipe incoming request to API server
      req.pipe(proxyReq);
    });
  }

  // ----------------------------------------------------------------
  private getNextPort = () => {
    const port = this.proxyPorts[this.portIndex];
    this.portIndex = ++this.portIndex % this.proxyPorts.length;
    return port;
  };

  // ----------------------------------------------------------------
  private copyHeaders = (src: IncomingMessage, dest: ServerResponse) => {
    const { statusCode = 200, statusMessage, headers } = src;
    dest.writeHead(statusCode, statusMessage, headers);
  };
}
