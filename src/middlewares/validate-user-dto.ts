import { Middleware } from '../lib/api-server.js';

const MIN_USERNAME_LENGTH = 3;
const MIN_AGE = 1;

// ----------------------------------------------------------------
// Checks if the request body is a valid UserDto
//
export const validateUserDto: Middleware = (req, res, next) => {
  const body = typeof req.body === 'object' ? req.body : {};

  let message = '';
  if (typeof body.username !== 'string') {
    message = `Username is required`;
  } else if (body.username.length < MIN_USERNAME_LENGTH) {
    message = `Username must be at least ${MIN_USERNAME_LENGTH} characters long`;
  } else if (typeof body.age !== 'number') {
    message = `Age is required`;
  } else if (body.age < MIN_AGE) {
    message = `Age must be at least ${MIN_AGE} years`;
  } else if (!Array.isArray(body.hobbies)) {
    message = `Hobbies list is required`;
  } else if (body.hobbies.some((item) => typeof item !== 'string')) {
    message = `Hobbies must be a list of strings`;
  }

  if (message) {
    res.writeHead(400).end(JSON.stringify({ message }));
  } else {
    next();
  }
};
