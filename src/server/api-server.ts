import { createServer, type Server } from 'http';
import type { Method, Middleware, Request, Response } from '../types.js';

export class ApiServer {
  private server: Server;
  private middlewares: {
    method: Method;
    path: string;
    callbacks: Middleware[];
  }[];

  constructor() {
    this.server = createServer(this.requestListener);
    this.middlewares = [];
  }

  // ----------------------------------------------------------------
  // Mounts middlewares to the specified path
  //
  use = (method: Method, path: string, ...callbacks: Middleware[]) => {
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
  private requestListener = async (req: Request, res: Response) => {
    try {
      // declare next() function
      let error: Error | null = null;
      let shouldGoNext: boolean;
      const next = (err: Error | null = null) => {
        error = err;
        shouldGoNext = true;
      };

      // prepare request and response objects
      req.body = await ApiServer.getBody(req);
      res.setHeader('Content-Type', 'aplication/json');

      // pass the request through middlewares
      for (const { method, path, callbacks } of this.middlewares) {
        // check if method matches
        const isMethodMatches = method === '*' || method === req.method;
        if (!isMethodMatches) continue;

        // check if url matches
        req.params = ApiServer.matchUrl(path, req.url ?? '');
        if (!req.params) continue;

        // invoke callbacks:
        // - await if it's async function
        // - throw exception if next(error) has been called
        // - go further if next() has been called, and stop otherwise
        for (const callback of callbacks) {
          shouldGoNext = false;
          const maybePromise = callback(req, res, next);
          if (maybePromise instanceof Promise) await maybePromise;
          if (error) throw error;
          if (!shouldGoNext) return;
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
  private static getBody = async (req: Request) =>
    new Promise<string>((resolve, reject) => {
      const data: Buffer[] = [];
      req
        .on('data', (chunk) => data.push(chunk))
        .on('end', () => resolve(Buffer.concat(data).toString()))
        .on('error', reject);
    });

  // ----------------------------------------------------------------
  // Compares url with the given path and returns named parameters if they exist
  //
  private static matchUrl = (path: string, url: string): Record<string, string> | undefined => {
    const pattern = path
      .split('/')
      .map((s) => (s.startsWith(':') ? `(?<${s.slice(1)}>[\\w-]+)` : s))
      .join('\\/');
    const match = new RegExp('^' + pattern + '$').exec(url);
    return match ? match.groups ?? {} : undefined;
  };
}
