
# Basic Example

This example shows how to create a basic user system using Nebra and Express.

::: info Note 
  This example assumes you have a basic Node.js project setup with Typescript.\
  If you dont't have it, you can set it up using tools like [tsx](https://github.com/esbuild-kit/tsx).
:::

## Setup

First, install the required dependencies:

```sh
npm install nebra
npm install express
npm install body-parser
```

We'll use the following file structure:
  
```
├── src
│   ├── index.ts                # Entry point of the application
│   ├── database
│   │   └── database.ts         # Database connection
│   └── interfaces
│       └── user.ts             # User interface
```

## Creating the database

We'll start by creating an interface for our users:

```ts
// src/interfaces/user.ts
import { Document } from 'nebra';

export interface User {
  username: string;
  email: string;
  password: string;
}

export type UserDocument = Document<User>;
```

Next, we'll create a database connection and add a users collection to it, passing in our user interface:

```ts
// src/database/database.ts
import { nebra } from 'nebra';

export const db = nebra('path/to/database.sqlite');
export const Users = db.collection<User>('users');
```

After this, we have the basics of our database connection handled and we can create some api routes to interact with it.

## Creating the API

We'll start by creating a simple route to create a user:

```ts
// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import { Users } from './database/database';
import { User, UserDocument } from './interfaces/user';

const app = express();
app.use(bodyParser.json());

app.post('/api/users', async (req, res) => {
  const user: User = req.body;
  try {
    const newUser: UserDocument = Users.insert(user);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

This route will create a new user in the database and return the created user.\
If an error occurs, it will return a 500 error with the error message.

Next, we'll create a route to get all users:

```ts
// src/index.ts
app.get('/api/users', async (req, res) => {
  try {
    const users: UserDocument[] = Users.query().find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

This route will return all users in the database by making a query without constraints.

After this, we'll create a route to get a single user by id:

```ts
// src/index.ts
app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user: UserDocument = Users.query()
      .equalTo('_id', id)
      .first();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

This route will return a single user by id by making a query with an equality constraint on the `_id` field.
If the user is not found, it will return a 404 error.

Finally, we'll create a route to update a user:

```ts
// src/index.ts
app.put('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const user: User = req.body;
  try {
    const updatedUser: UserDocument = Users.update(id, user);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

And just like that, we have a basic CRUD API for our users using Nebra and Express.
As you can see, Nebra is very simple to use and allows you to create a type-safe database with minimal effort.

## Conclusion

In this example, we learned how to create a basic user system using Nebra and Express.\
There are many things we left out of this example, like runtime payload validation and better error handling, but this should give you a good idea of how to use Nebra in your projects.
