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
const db = await nebra('path/to/database.db'); // Or :memory: for in-memory sqlite

// Add a collection to the tabase
const Users = await db.collection('users');

// Insert a new json document to the collection
const user = await Users.insert({
  name: 'Darth Vader',
  email: 'i_am_your_father@deathstar.net',
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

### Table of Contents
- [Description](#description)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Example usage](#example-usage)
- [Documentation](#documentation)
  - [Table of Contents](#table-of-contents)
  - [Connecting to a database](#connecting-to-a-database)
    - [Testing the connection](#testing-the-connection)
    - [Closing the connection](#closing-the-connection)
  - [Collections](#collections)
  - [Inserting documents](#inserting-documents)
  - [Updating documents](#updating-documents)
  - [Deleting documents](#deleting-documents)
  - [Renaming collections](#renaming-collections)
  - [Dropping collections](#dropping-collections)
  - [Queries](#queries)
    - [Basic queries](#basic-queries)
    - [Array fields and queries](#array-fields-and-queries)
    - [Query lookups](#query-lookups)
    - [Compound queries](#compound-queries)
  - [Reference of all query methods](#reference-of-all-query-methods)
    - [Equality](#equality)
    - [Arrays](#arrays)
    - [Existence](#existence)
    - [Regular expressions](#regular-expressions)
    - [Compound queries](#compound-queries-1)
    - [Sorting](#sorting)
    - [Special queries](#special-queries)
    - [Executing queries](#executing-queries)
- [Contributing](#contributing)
- [License](#license)

### Connecting to a database

To connect to a database, you must create a new instance of Nebra. This can be done by importing the nebra function and then passing to it a string representing the path for the location of the database:

```typescript
import { nebra } from 'nebra';

const db = nebra('path/to/database.db');
```

Alternatively you can pass `:memory:` to the instance to get an in-memory database.

#### Testing the connection

You can use the `.authenticate()` method to test the if the connection was successful:

```typescript
try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
```

#### Closing the connection

The connection will be kept open by default and will be used by all queries.
If you need to close it you can call the `.close()` method, which will return a promise.

> **Note:** Once a connection is closed it cannot be reopened, you will need to create a new instance of nebra to access the database again.
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

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

Querying the collection now will return an array of `Document<User>`, the `Document<T>` type wraps your interface and adds the required \_id and timestamp fields added by Nebra.
In the example above the `Document<User>` will have the follwing structure:

```typescript
type Document<User> = {
  _id: string; // Autogenerated ObjectId string
  username: string; // Username key from the User type
  password: string; // Password key from the User type
  createdAt: string; // ISO date string managed by Nebra
  updatedAt: string; // ISO date string managed by Nebra
};
```
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Inserting documents

After we have our collection created, we can start inserting documents into them. Documents are just plain javascript objects that can contain any data with the only limit being that it should be serializable as a string.
To insert a new document into our collection we can use the `.insert()` method:

```typescript
const Users = await db.collection('users');
const user = await user.insert({
  username: 'NeoTheOne',
  email: 'neo@matrix.com',
  password: 'redpillbluepill',
});
```

The `.insert()` method will return a promise that resolves to the inserted document, with the \_id and timestamp fields added by Nebra.

You can also insert multiple documents at once by using the `.insertMany()` method, which takes an array of documents and returns a promise that resolves to an array of the inserted documents.

```typescript
const Users = await db.collection('users');
const newUsers = await user.insertMany([
  {
    username: 'GandalfTheGrey',
    email: 'gandalf@middleearth.com',
    password: 'youshallnotpass',
  },
  {
    username: 'PrincessLeia',
    email: 'leia@rebelalliance.com',
    password: 'helpmeobiwankenobi',
  },
]);
```
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Updating documents

To update a document in a collection you can use the `.update()` method, which takes an ObjectID string as the first argument and the updated document as the second.
The update can be partial since the method will merge the new document with the existing one, only updating the fields that are present in the new document.

```typescript
const Users = await db.collection('users');
const user = await Users.insert({
  username: 'CaptainJackSparrow',
  email: 'jack@blackpearl.com',
  password: 'savvymehearties',
});

const updated = await Users.update(user._id, {
  password: 'xmarksthespot',
});

console.log(updated.password); // xmarksthespot
console.log(user.createdAt !== updated.updatedAt); // true
```

You can also update multiple documents at once by using the `.updateMany()` method, which takes an array of ObjectID strings as the first argument and an array of the corresponding updated documents as the second.

```typescript
const Users = await db.collection('users');
const users = await Users.insertMany([
  {
    username: 'MartyMcFly',
    email: 'marty@timemachine.com',
    password: '88milesperhour',
  },
  {
    username: 'DarthVader',
    email: 'vader@empire.com',
    password: 'iamyourfather',
  },
]);

const updatedUsers = await Users.updateMany(
  [users[0]._id, users[1]._id],
  [
    {
      password: 'fluxcapacitor',
    },
    {
      password: 'darksideforce',
    },
  ]
);
```
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Deleting documents

To delete a document from a collection you can use the `.delete()` method, which takes an ObjectID string as the first argument and returns a promise that resolves to true if the document was deleted:

```typescript
const Users = await db.collection('users');
const user = await Users.insert({
  username: 'HermioneGranger',
  email: 'hermione@hogwarts.com',
  password: 'wingardiumleviosa',
});

const deleted = await Users.delete(user._id);
console.log(deleted); // true
```

You can also delete multiple documents at once by using the `.deleteMany()` method, which takes an array of ObjectID strings as the first argument and returns a promise that resolves to true if all the documents were deleted:

```typescript
const Users = await db.collection('users');
const users = await Users.insertMany([
  {
    username: 'TonyStark',
    email: 'tony@starkindustries.com',
    password: 'iloveyou3000',
  },
  {
    username: 'DoryTheFish',
    email: 'dory@findingsomedory.com',
    password: 'justkeepswimming',
  },
]);

const deleted = await Users.deleteMany([
  users[0]._id, 
  users[1]._id
]);

console.log(deleted); // true
```
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Renaming collections

To rename a collection you can use the `.rename()` method, which takes the new name as the first argument and returns a promise.

```typescript
const Users = await db.collection('users');
await Users.rename('people');
```
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Dropping collections

To drop a collection you can use the `.drop()` method:

```typescript
const Users = await db.collection('users');
await Users.drop();
```
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Queries

Querying a database is never an easy task, but Nebra tries to make it as simple as possible by providing a simple, yet powerful, query builder.

Nebra queries are heavily inspired by [Parse](https://parseplatform.org/), so if you're familiar with it you'll feel right at home.

#### Basic queries
To start a query you can use the `.query()` method on a collection, which will return a new query builder instance:

```typescript
const Users = await db.collection('users');
const query = Users.query();
```
Once you have a query builder instance you can start building your query by using the various query methods available. All query methods return the query builder instance, so you can chain them together to build your query.

> **Note:** Query methods are additive, so calling the same method multiple times will add multiple conditions to the query.

> **Note:** `.exec()` and `.count()` are the only methods that do not return the query builder instance, but instead return a promise that resolves to the result of the query.

```typescript
const Users = await db.collection('users');
const query = Users.query()
  .equalTo('username', 'MartyMcFly')
  .notEqualTo('email', 'vader@empire.com')

const result = await query.exec();
console.log(result); // Array of documents
```
A query will always return an array of documents, even if only one document matches the query. If no documents match the query, an empty array will be returned.

#### Array fields and queries

Working with array fields can be tricky and it adds some limitations to the queries you can perform on them.
This means that all the query methods expect the field to not be an array, so if you want to query an array field you need to use the dedicated query methods for comparing arrays: `.containedIn()` and `.notContainedIn()`.

```typescript
const Users = await db.collection('users');
const query = Users.query()
  .containedIn('hobbies', ['surfing', 'skateboarding'])
  .notContainedIn('hobbies', ['reading', 'writing'])
```

To count the number of documents that match a query you can use the `.count()` method:

```typescript
const Users = await db.collection('users');
const query = Users.query()
  .equalTo('username', 'TonyStark')
  
const count = await query.count();
console.log(count); // 1
```

#### Query lookups

Query lookups are the way to query relational data in Nebra. They allow you to query a different collection and merge the results into the current query.

To perform a query lookup you can use the `.lookup()` method, which takes the name of the collection you want to query as the first argument and a lookup options object as the second argument.

The lookup options object has the following properties:

``` typescript
interface LookupOptions {
  from: string;         // Name of the collection to query
  localField: string;   // Name of the field in the current collection
  foreignField: string; // Name of the field in the collection to query
  as: string;           // Name of the field to store the results in (in the current collection documents)
  limit?: number;       // Maximum number of results to return
  skip?: number;        // Number of results to skip
  sort?: SortOptions;   // Sort options
}

interface SortOptions {
  [key: string]: 'asc' | 'desc';  // Field name and sort direction
}
```

```typescript
const Users = await db.collection('users');
const query = Users.query()
  .equalTo('username', 'TonyStark')
  .lookup('posts', {
    from: 'posts',
    localField: '_id',
    foreignField: 'author',
    as: 'posts',
    limit: 10,
    skip: 0,
    sort: {
      createdAt: 'desc',
    },
  });

const result = await query.exec();
```
The previous lookup query will return an array of documents with the `posts` field populated with the 10 most recent posts by Tony Stark: 

```typescript
// Result:
const result = [{
  _id: '...',
  username: 'TonyStark',
  email: 'tony@starkindustries.com',
  posts: [{
    _id: '...',
    title: '...',
    content: '...',
  }]
}]
```

#### Compound queries

Compound queries allow you to combine multiple queries together to create more complex queries.

To create a compound query you can use the `.and()` and `.or()` methods, which take a query builder instance as the argument.

```typescript
const Users = await db.collection('users');
const baseQuery = Users.query();

const nameQuery = Users.query();
nameQuery.equalTo('username', 'HermioneGranger');

const emailQuery = Users.query();
emailQuery.equalTo('email', 'dory@findingsomedory.com');

baseQuery.and(nameQuery);
baseQuery.or(emailQuery);

const result = await baseQuery.exec();
```
The previous compound query will return an array of documents that match either the `nameQuery` or the `emailQuery`.

You can find a list of all the available query methods [below](#reference-of-all-query-methods).
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Reference of all query methods

#### Equality 
- `equalTo(field: string, value: any | any[])`: Checks if the value of the field is equal to the given value. If the value is an array, it will check if the field contains any of the values in the array. (Field must not be an array)
- `notEqualTo(field: string, value: any | any[])`: Checks if the value of the field is not equal to the given value. If the value is an array, it will check if the field does not contain any of the values in the array.
- `greaterThan(field: string, value: any)`: Checks if the value of the field is greater than the given value.
- `greaterThanOrEqualTo(field: string, value: any)`: Checks if the value of the field is greater than or equal to the given value.
- `lessThan(field: string, value: any)`: Checks if the value of the field is less than the given value.
- `lessThanOrEqualTo(field: string, value: any)`: Checks if the value of the field is less than or equal to the given value.

#### Arrays
- `containedIn(field: string, values: any[])`: Checks if the array in the field contains any of the given values. (Field must be an array)
- `notContainedIn(field: string, values: any[])`: Checks if the array in the field does not contain any of the given values. (Field must be an array)

#### Existence
- `exists(field: string)`: Checks if the field exists.
- `notExists(field: string)`: Checks if the field does not exist.

#### Regular expressions
- `matches(field: string, regex: RegExp)`: Checks if the value of the field matches the given regular expression.
- `doesNotMatch(field: string, regex: RegExp)`: Checks if the value of the field does not match the given regular expression.

#### Compound queries
- `or(query: Query)`: Combines the current query with the given query using the OR operator.
- `and(query: Query)`: Combines the current query with the given query using the AND operator.

#### Sorting
- `limit(limit: number)`: Limits the number of documents returned by the query.
- `skip(skip: number)`: Skips the first n documents returned by the query.
- `first()`: Returns the first document returned by the query.
- `last()`: Returns the last document returned by the query.
- `ascending(field: string)`: Sorts the documents in ascending order by the given field.
- `descending(field: string)`: Sorts the documents in descending order by the given field.

#### Special queries
- `fullText(field: string, value: string)`: Checks if the value of the field contains the given value using SQL's LIKE operator.
- `lookup(options: LookupOptions)`: Performs a lookup to another collection.

#### Executing queries
- `exec()`: Executes the query and returns a promise that resolves to an array of documents.
- `count()`: Executes the query and returns a promise that resolves to the number of documents returned by the query.
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Contributing

Thanks for your interest in contributing! Please, read on the guidelines for [contributing](CONTRIBUTING.md) and then check the [issues](https://github.com/aerotoad/nebra/issues) to see if there's anything you can help with.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (Affero General Public License v3.0).

