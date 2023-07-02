// ****************************************************************
// * Minimalistic Express-like server
// ****************************************************************

import type { IncomingMessage, Server, ServerResponse } from 'http';
import { createServer } from 'http';
import { isRegExp } from 'util/types';

export type Method = '*' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Request = IncomingMessage & {
  params?: Record<string, string>;
  body?: string | Record<string, unknown>;
};
export type Next = (err?: Error) => void;
export type Middleware = (req: Request, res: ServerResponse, next: Next) => void | Promise<void>;

export class ApiServer {
  private server: Server;
  private middlewares: {
    method: Method;
    path: string | RegExp;
    callbacks: Middleware[];
  }[] = [];

  constructor() {
    this.server = createServer(this.requestListener);
  }

  // ----------------------------------------------------------------
  // Mounts middlewares to the specified path
  //
  use = (method: Method, path: string | RegExp, ...callbacks: Middleware[]) => {
    this.middlewares.push({ path, method, callbacks });
  };

  // ----------------------------------------------------------------
  // Starts the HTTP server listening for connections
  //
  listen = (port: number, callback?: () => void) => {
    this.server.listen(port, callback);
  };

  // ----------------------------------------------------------------
  // Handles incoming requests and passes them through middlewares stack
  //
  private requestListener = async (req: Request, res: ServerResponse) => {
    try {
      // declare next() function
      let error: Error | null = null;
      let nextWasCalled: boolean;
      const next = (err: Error | null = null) => {
        error = err;
        nextWasCalled = true;
      };

      // prepare request and response objects
      req.body = await ApiServer.getBody(req);
      res.setHeader('Content-Type', 'aplication/json');

      // pass the request through middlewares
      for (const { method, path, callbacks } of this.middlewares) {
        // check if method matches
        const isMethodMatches = method === '*' || method === req.method;
        if (!isMethodMatches) continue;

        // check if route matches
        req.params = ApiServer.matchUrl(path, req.url ?? '');
        if (!req.params) continue;

        // invoke route middlewares:
        // - await if it's an async middleware
        // - stop handling middlewares if next(error) is called or if next() wasn't called
        for (const callback of callbacks) {
          nextWasCalled = false;
          const maybePromise = callback(req, res, next);
          if (maybePromise instanceof Promise) await maybePromise;
          if (error) throw error;
          if (!nextWasCalled) return;
        }
      }

      // return 404 if the response hasn't been sent yet
      res.writeHead(404).end(JSON.stringify({ message: 'Not Found' }));
    } catch (error) {
      // handle any uncaught errors and return 500
      res.statusCode = 500;
      if (error instanceof Error) {
        res.write(JSON.stringify({ message: error.message }));
      }
      res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
  };

  // ----------------------------------------------------------------
  // Returns a body as a string
  //
  private static getBody = (req: Request) => {
    return new Promise<string>((resolve, reject) => {
      const data: Buffer[] = [];
      req
        .on('data', (chunk) => data.push(chunk))
        .on('end', () => resolve(Buffer.concat(data).toString()))
        .on('error', reject);
    });
  };

  // ----------------------------------------------------------------
  // Compares url with the given path and returns named parameters if they exist
  //
  private static matchUrl = (path: string | RegExp, url: string) => {
    const pattern = isRegExp(path)
      ? path
      : new RegExp(
          `^${path
            .split('/')
            .map((s) => (s.startsWith(':') ? `(?<${s.slice(1)}>[\\w-]+)` : s))
            .join('\\/')}$`
        );
    const match = pattern.exec(url);
    return match ? match.groups ?? {} : undefined;
  };
}
