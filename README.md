# CRUD API

A simple CRUD API using in-memory database

## API reference

### Get all users

```http
GET /api/users
```

### Get user by id

```http
GET /api/users/{user_id}
```

### Create a new user

```http
POST /api/users
```

### Update user by id

```http
PUT /api/users/{user_id}
```

### Delete user by id

```http
DELETE /api/users/{user_id}
```

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

### \* You can run tests by typing the following command

```sh
npm run test
```
