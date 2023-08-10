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
    <b>:minidisc: SQLite</b> |
    <b>:battery: Batteries Included</b> |
    <b>:lotus_position: Flexible</b>
  </p>

  <hr />
</div>

## Description

Nebra (pronounced /ˈnɛβɾa̝/, [from Galician](https://en.wiktionary.org/wiki/nebra): «fog») is a simple, yet powerful, type-safe NoSQL database library for Node.js. It offers seamless data management with compile-time type-checking for enhanced reliability. Leveraging SQLite, Nebra ensures efficient and lightweight performance, making it perfect for Electron and other platforms. With its unique approach, Nebra empowers you to use a relational database as a NoSQL, providing the flexibility to harness the best of both worlds. Effortlessly manage your data and embrace a misty-smooth database experience.

Under the hood, Nebra makes use of [better-sqlite3](https://github.com/WiseLibs/better-sqlite3), a high-performance SQLite wrapper. This powerful tool allows Nebra to deliver optimal performance and ensure smooth interactions with the database. Whether you're building a desktop application with Electron or a web-based project, Nebra's reliable and efficient architecture has got you covered.

## Getting Started

It's recommended to read the [documentation](https://aerotoad.github.io/nebra/) to learn more about Nebra and how to use it.

If you want to jump right in, you can install Nebra in your project and start using folliwing the steps below:

### Install Nebra
```sh
npm install nebra
```

### Create a new Nebra instance and initialize the database
```typescript
import { nebra } from 'nebra';
const db = nebra('path/to/database.db');
```

### Create a new collection
```typescript
const Users = db.collection('users');
```

### Insert a new document to the collection
```typescript
const user = Users.insert({
  name: 'Darth Vader',
  email: 'vader@imperial.net'
});
```

And just like that, you have a new collection populated with a document. You can now query the collection to retrieve the document.

If you want to learn more about Nebra, you can read the [documentation](https://aerotoad.github.io/nebra/) to get started.

Happy hacking! :tada:

## Documentation

You can see the documentation on the [website](https://aerotoad.github.io/nebra/). 
<br/>
Below you can find table of contents with useful links to the documentation.

#### Introduction
- [What is Nebra](https://aerotoad.github.io/nebra/guide/what-is-nebra)
- [Gettting Started](https://aerotoad.github.io/nebra/guide/getting-started)

#### Basic Usage
- [Connecting to a Database](https://aerotoad.github.io/nebra/guide/basic/connecting-a-database)
- [Working with collections](https://aerotoad.github.io/nebra/guide/basic/working-with-collections)

#### Queries
- [Creating Queries](https://aerotoad.github.io/nebra/guide/queries/creating-queries)
- [Query constraints](https://aerotoad.github.io/nebra/guide/queries/query-constraints)
- [Relational Data](https://aerotoad.github.io/nebra/guide/queries/relational-data)

## Contributing

Thanks for your interest in contributing! Please, read on the guidelines for [contributing](CONTRIBUTING.md) and then check the [issues](https://github.com/aerotoad/nebra/issues) to see if there's anything you can help with.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (Affero General Public License v3.0).

