import type { IncomingMessage, ServerResponse } from 'http';

// ----------------------------------------------------------------
// ApiServer types
//
export type Method = '*' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Request = IncomingMessage & {
  params?: Record<string, string>;
  body?: string | Record<string, unknown>;
};

export type Response = ServerResponse;

export type Next = (err?: Error) => void;

export type Middleware = (req: Request, res: Response, next: Next) => void | Promise<void>;

// ----------------------------------------------------------------
// User types
//
export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type UserDto = Omit<User, 'id'>;
