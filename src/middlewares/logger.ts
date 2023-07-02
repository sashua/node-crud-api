import { Middleware } from '../lib/api-server.js';

// ----------------------------------------------------------------
// Just a simple logger middleware
//
export const logger =
  (prefix: string, delimiter = '--'): Middleware =>
  (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const time = Date.now() - startTime;
      console.log(
        `(${prefix}) ${delimiter} ${req.method} ${req.url} ${delimiter} ${res.statusCode} ${delimiter} ${time}ms`
      );
    });
    next();
  };
