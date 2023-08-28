<div align="center">
  <h1>Neboa :fog:</h1>
  <h4><i>Seamless Data Management with Neboa: Type-Safe NoSQL for Node & SQLite.</i></h4>
  <a href="https://www.npmjs.com/neboa" rel="nofollow">
    <img alt="Neboa on npm" src="https://img.shields.io/npm/v/neboa.svg?logo=npm&amp;logoColor=fff&amp;label=NPM+package&amp;color=f59e0b" style="max-width: 100%;">
  </a>
  <a href="https://github.com/aerotoad/neboa/actions/workflows/ci.yml">
    <img src="https://github.com/aerotoad/neboa/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://github.com/aerotoad/neboa/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/aerotoad/neboa">
  </a>
  <img src="https://img.shields.io/badge/Project%20Status-Alpha-yellow?logo=git&amp;logoColor=white" style="max-width: 100%;">
  <a href="https://github.com/aerotoad/neboa/blob/main/CONTRIBUTING.md">
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

Neboa (pronounced /ˈnɛβo̯a̝/, [from Galician](https://en.wiktionary.org/wiki/n%C3%A9boa#Galician): «fog») is a simple, yet powerful, type-safe NoSQL database library for Node.js. It offers seamless data management with compile-time type-checking for enhanced reliability. Leveraging SQLite, Neboa ensures efficient and lightweight performance, making it perfect for Electron and other platforms. With its unique approach, Neboa empowers you to use a relational database as a NoSQL, providing the flexibility to harness the best of both worlds. Effortlessly manage your data and embrace a misty-smooth database experience.

Under the hood, Neboa makes use of [better-sqlite3](https://github.com/WiseLibs/better-sqlite3), a high-performance SQLite wrapper. This powerful tool allows Neboa to deliver optimal performance and ensure smooth interactions with the database. Whether you're building a desktop application with Electron or a web-based project, Neboa's reliable and efficient architecture has got you covered.

## Getting Started

It's recommended to read the [documentation](https://aerotoad.github.io/neboa/) to learn more about Neboa and how to use it.

If you want to jump right in, you can install Neboa in your project and start using folliwing the steps below:

### Install Neboa
```sh
npm install neboa
```

### Create a new Neboa instance and initialize the database
```typescript
import { neboa } from 'neboa';
const db = neboa('path/to/database.db');
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

If you want to learn more about Neboa, you can read the [documentation](https://aerotoad.github.io/neboa/) to get started.

Happy hacking! :tada:

## Documentation

You can see the documentation on the [website](https://aerotoad.github.io/neboa/). 
<br/>
Below you can find table of contents with useful links to the documentation.

#### Introduction
- [What is Neboa](https://aerotoad.github.io/neboa/guide/what-is-neboa)
- [Gettting Started](https://aerotoad.github.io/neboa/guide/getting-started)

#### Basic Usage
- [Connecting to a Database](https://aerotoad.github.io/neboa/guide/basic/connecting-a-database)
- [Working with collections](https://aerotoad.github.io/neboa/guide/basic/working-with-collections)

#### Queries
- [Creating Queries](https://aerotoad.github.io/neboa/guide/queries/creating-queries)
- [Query constraints](https://aerotoad.github.io/neboa/guide/queries/query-constraints)
- [Relational Data](https://aerotoad.github.io/neboa/guide/queries/relational-data)

## Contributing

Thanks for your interest in contributing! Please, read on the guidelines for [contributing](CONTRIBUTING.md) and then check the [issues](https://github.com/aerotoad/neboa/issues) to see if there's anything you can help with.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (Affero General Public License v3.0).

