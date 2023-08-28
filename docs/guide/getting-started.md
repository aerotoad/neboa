
# Getting Started

Starting using Neboa is very simple, and this guide will walk you through the process of installing it and the basics of its usage.

<div class="tip custom-block" style="padding-top: 8px">
This guide assumes you are running Neboa in a <b>Node.js environment</b>.<br> 
Neboa is not meant to be used in a browser, and it will not work in one.
</div>

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) version 18 or higher
- [npm](https://www.npmjs.com/) version 7 or higher
- Basic knowledge of [TypeScript](https://www.typescriptlang.org/)

You can install Neboa using npm:

::: code-group
```sh [npm]
$ npm install neboa
```
```sh [yarn]
$ yarn add neboa
```
```sh [pnpm]
$ pnpm add neboa
```
:::

::: details Do I need to install better-sqlite3?
Neboa has better-sqlite3 as a dependency, so it should be installed automatically. But if you get a warning about it, you can install it manually with:

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
Neboa works as both an ESM package and a CommonJS module.
With that being said, the main target for Neboa is ESM, so if you're using CommonJS you might run into some issues.
This guide will assume you're using ESM, but if you're using CommonJS, you can still follow along.

To use Neboa as a CommonJS module, you need to replace imports like so:
  
```js
// ESM
import { neboa } from 'neboa'

// CommonJS
const { neboa } = require('neboa')
```
:::

## Basic Usage

After installing Neboa, you can just import it and start using it:

```ts
import { neboa } from 'neboa'

// Create a database
const db = neboa('database.db') 
// You can also use an in-memory database with neboa(':memory:')

const Users = db.collection('users') // Create a collection
Users.insert({ name: 'John Doe', age: 42 }) // Insert a document

const query = Users.query() // Create a query
  .equalTo('name', 'John Doe') // Add constraints
  .limit(1) // Limit the results to 1
const user = query.find(); // Execute the query
console.log(user) // { name: 'John Doe', age: 42 }
```

As you can see Neboa is very simple to use, and it provides a fully sincronous API, so you don't need to worry about callbacks or promises.

According to [better-sqlite3](https://github.com/WiseLibs/better-sqlite3), the fully syncronous API provides better concurrency than an async API.
