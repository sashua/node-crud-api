import { validate } from 'uuid';
import { Middleware } from '../lib/api-server.js';

// ----------------------------------------------------------------
// Checks if the request contains a valid id parameter
//
export const validateId: Middleware = async (req, res, next) => {
  const id = req.params?.id ?? '';
  if (validate(id)) {
    next();
  } else {
    res.writeHead(400).end(JSON.stringify({ message: 'Invalid user id' }));
  }
};
