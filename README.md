<div align="center">
  <h1>Nebra :fog:</h1>
  <h4><i>Seamless Data Management with Nebra: Type-Safe NoSQL for Node & SQLite.</i></h4>
  <a href="https://www.npmjs.com/nebra" rel="nofollow">
    <img alt="Nebra on npm" src="https://img.shields.io/npm/v/nebra.svg?logo=npm&amp;logoColor=fff&amp;label=NPM+package&amp;color=f59e0b" style="max-width: 100%;">
  </a>
  <a href="https://github.com/aerotoad/nebra/actions/workflows/ci.yml">
    <img src="https://github.com/aerotoad/nebra/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://github.com/aerotoad/nebra/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/aerotoad/nebra">
  </a>
  <img src="https://img.shields.io/badge/Project%20Status-Alpha-yellow?logo=git&amp;logoColor=white" style="max-width: 100%;">
  <a href="https://github.com/aerotoad/nebra/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" style="max-width: 100%;">
  </a>

  &nbsp;

  <p align="center" dir="auto">
    <b>:sparkles: Type-Safe</b> |
    <b>:wrench: Knex-Powered</b> |
    <b>:minidisc: SQLite-Based</b> |
    <b>:rainbow: Effortless</b> |
    <b>:lotus_position: Flexible</b>
  </p>

  <hr />
</div>

## Description

Nebra is a powerful, type-safe NoSQL database library for Node.js. It offers seamless data management with compile-time type-checking for enhanced reliability. Leveraging SQLite, Nebra ensures efficient and lightweight performance, making it perfect for Electron and other platforms. With its unique approach, Nebra empowers you to use a relational database as a NoSQL, providing the flexibility to harness the best of both worlds. Effortlessly manage your data and embrace a misty-smooth database experience.

Under the hood, Nebra makes use of [Knex.js](https://knexjs.org/), a flexible SQL query builder, and [better-sqlite3](https://github.com/WiseLibs/better-sqlite3), a high-performance SQLite wrapper. These powerful tools allow Nebra to deliver optimal performance and ensure smooth interactions with the database. Whether you're building a desktop application with Electron or a web-based project, Nebra's reliable and efficient architecture has got you covered. 

## Getting Started

### Installation

To get started with Nebra, you can install it via npm. Open your terminal or command prompt and run the following command:
```bash
npm install nebra
```
### Example usage

Now that you have Nebra installed, you can start using it to manage your data with ease. Below is a basic example of how to set up and interact with the database using Nebra:

```typescript
import { nebra } from 'nebra'; // Or const {nebra} = require('nebra') for CommonJs

// Create a new Nebra instance and initialize the database
const db = await nebra('path/to/database.db') // Or :memory: for in-memory sqlite

// Add a collection to the tabase
const Users = await db.collection('users');

// Insert a new json document to the collection
const user = await Users.insert({
  name: 'Darth Vader',
  email: 'i_am_your_father@deathstar.net'
});

// Create a new query for the collection
const query = Users.query();
// Add constraints
query.equalTo('name', 'Darth Vader');
// Execute the query
const results = await query.exec();
console.log(results[0]); // { name: 'Darth Vader', email: 'i_am_your_father@deathstar.net'}
```
This example demonstrates how to create a new Nebra instance, create a new collection and perform basic insert and query operations.

## Documentation

### Connecting to a database

To connect to a database, you must create a new instance of Nebra. This can be done by importing the nebra function and then passing to it a string representing the path for the location of the database:
```typescript
import { nebra } from 'nebra';

const db = nebra('path/to/database.db') 
```
Alternatively you can pass `:memory:` to the instance to get an in-memory database.

#### Testing the connection
You can use the `.authenticate()` method to test the if the connection was successful:
```typescript
try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch(error) {
  console.error('Unable to connect to the database:', error);
}
```

#### Closing the connection

The connection will be kept open by default and will be used by all queries. 
If you need to close it you can call the `.close()` method, which will return a promise.

> Note: Once a connection is closed it cannot be reopened, you will need to create a new instance of nebra to access the database again.

### Collections

Collections are the primary way to organise your data in Nebra, each collection maps to a table in the database and will contain your JSON documents.
A collection can be accessed by calling the `.collection()` function of the nebra instance:

```typescript
import { nebra } from 'nebra';

const db = await nebra('path/to/database.db');
const Users = await db.collection('users');
```
This will create a new table called users if it doesn't exist or a reference to it if it does, allowing you to perform queries to it.

You can also specify the type of the documents in the collection easily by passing the type to the collection method:

```typescript
import { nebra } from 'nebra';

const db = await nebra('path/to/database.db');

interface User {
  username: string;
  password: string;
}

const Users = await db.collection<User>('users');
```
Querying the collection now will return an array of `Document<User>`, the `Document<T>` type wraps your interface and adds the required _id and timestamp fields added by Nebra.
In the example above the `Document<User>` will have the follwing structure: 

```typescript
type Document<User> = {
  _id: string;       // Autogenerated ObjectId string
  username: string;  // Username key from the User type
  password: string;  // Password key from the User type
  createdAt: string; // ISO date string managed by Nebra
  updatedAt: string; // ISO date string managed by Nebra
}
```

### Inserting documents

After we have our collection created, we can start inserting documents into them. Documents are just plain javascript objects that can contain any data with the only limit being that it should be serializable as a string.
To insert a new document into our collection we can use the `.insert()` method:

```typescript
const Users = await db.collection('users');
const user = await user.insert({
  username: 'NeoTheOne',
  email: 'neo@matrix.com',
  password: 'redpillbluepill'
});

```

In progress...

## Contributing

Thanks for your interest in contributing! Please, read on the guidelines for [contributing](CONTRIBUTING.md) and then check the [issues](https://github.com/aerotoad/nebra/issues) to see if there's anything you can help with.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (Affero General Public License v3.0).
