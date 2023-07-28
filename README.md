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

In progress

## Contributing

Thanks for your interest in contributing! Please, read on the guidelines for [contributing](CONTRIBUTING.md) and then check the [issues](https://github.com/aerotoad/nebra/issues) to see if there's anything you can help with.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (Affero General Public License v3.0).
