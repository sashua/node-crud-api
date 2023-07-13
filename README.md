# CRUD API

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-272727?style=flat&logo=nodedotjs&logoColor=339933)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)

A simple CRUD API server created using the core `node:http` module that uses an in-memory database. Also implemended a multi-threaded mode with a load balancer that distributes incoming requests between several REST-server instances using the round-robin algorithm.

## API reference

| Endpoint                      | Description       |
| :---------------------------- | :---------------- |
| `GET /api/users`              | Get all users     |
| `GET /api/users/{user_id}`    | Get user by id    |
| `POST /api/users`             | Create a new user |
| `PUT /api/users/{user_id}`    | Update user by id |
| `DELETE /api/users/{user_id}` | Delete user by id |

## Run server locally

You must have [Node.js](https://nodejs.org/en/download/) installed on your computer

### 1. Clone this project locally

```sh
# by SSH
git clone git@github.com:sashua/node-crud-api.git

# or HTTPS
git clone https://github.com/sashua/node-crud-api.git
```

### 2. Go to the project directory

```sh
cd node-crud-api
```

### 3. Switch to `dev` branch and install dependencies

```sh
git checkout dev
npm install
```

### 4. Create `.env` file and set `PORT` environment variable (default port is `3000` if not specified)

```sh
echo "PORT=4000" > .env
```

### 5. Run the server in _single-_ or _multi-threaded_ mode

```sh
# single-threaded mode
npm run start:prod

# multi-threaded mode with load balancer
npm run start:multi:prod
```

### \* You can run tests by typing

```sh
npm run test
```

## Notes

This project was created as part of the _"Node.js"_ course

[Assignment description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

[![RS School](https://img.shields.io/badge/RS_School-Node.js_2023Q2-F8E856?style=flat)](https://rs.school)
