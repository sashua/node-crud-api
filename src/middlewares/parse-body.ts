import { Middleware } from '../lib/api-server.js';

// ----------------------------------------------------------------
// Looks if the request contains JSON body and parses it
//
export const parseBody: Middleware = (req, _, next) => {
  const { body, headers } = req;
  if (typeof body === 'string' && headers['content-type'] === 'application/json') {
    req.body = JSON.parse(body);
  }
  next();
};
