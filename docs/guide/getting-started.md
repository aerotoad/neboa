
# Getting Started

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) version 18 or higher
- [npm](https://www.npmjs.com/) version 7 or higher
- Basic knowledge of [TypeScript](https://www.typescriptlang.org/)

You can install Nebra using npm:

::: code-group
```sh [npm]
$ npm install nebra
```
```sh [yarn]
$ yarn add nebra
```
```sh [pnpm]
$ pnpm add nebra
```
:::

::: details Do I need to install better-sqlite3?
Nebra has better-sqlite3 as a dependency, so it should be installed automatically. But if you get a warning about it, you can install it manually with:

::: code-group
```sh [npm]
$ npm install better-sqlite3
```
```sh [yarn]
$ yarn add better-sqlite3
```
```sh [pnpm]
$ pnpm add better-sqlite3
```
:::

::: tip NOTE
Nebra works as both an ESM package and a CommonJS module.
With that being said, the main target for Nebra is ESM, so if you're using CommonJS you might run into some issues.
This guide will assume you're using ESM, but if you're using CommonJS, you can still follow along.

To use Nebra as a CommonJS module, you need to replace imports like so:
  
```js
// ESM
import { nebra } from 'nebra'

// CommonJS
const { nebra } = require('nebra')
```
:::

## Basic Usage

After installing Nebra, you can just import it and start using it:

```ts
import { nebra } from 'nebra'

// Create a database
const db = nebra('database.db') 
// You can also use an in-memory database with nebra(':memory:')

const Users = db.collection('users') // Create a collection
Users.insert({ name: 'John Doe', age: 42 }) // Insert a document

const query = Users.query() // Create a query
  .equalTo('name', 'John Doe') // Add constraints
  .limit(1) // Limit the results to 1
const user = query.exec(); // Execute the query
console.log(user) // { name: 'John Doe', age: 42 }
```

As you can see Nebra is very simple to use, and it provides a fully sincronous API, so you don't need to worry about callbacks or promises.

According to [better-sqlite3](https://github.com/WiseLibs/better-sqlite3), the fully syncronous API provides better concurrency than an async API.
