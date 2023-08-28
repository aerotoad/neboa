
# Creating Queries

Queries are the primary way of interacting with the database. \
They allow you to retrieve documents from the database with ease and efficiency, providing you with many different constraints and options.

## Basic Usage

To create a query, you can use the `query` method on the collection instance. \
This method will return a query instance, which is the base to build your query on.

```ts
import { neboa } from 'neboa'

const db = neboa('database.db')

const Users = db.collection('users')

const query = Users.query()
```
After creating the query instance, you can chain methods to build your query before finally executing it with the `exec` method.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')

const result = query.find()
```
Creating queries this way also allows you reuse the query instance, which can be useful in some cases.

## Executing Queries

To execute a query, there are multiple methods available on the query instance, depending on the type of result you want to get.

### `find`

The `find` method is the main way of executing a query. It will return an array of documents that match the query following exactly every constraint you set.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')

const result = query.find() // [ { _id: '...', name: 'John Doe' } ]
```

### `first`

The `first` method will return the first document that matches the query.
It does so by adding a limit of 1 to the query and returning the first document of the result.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')

const result = query.first() // { _id: '...', name: 'John Doe' }
```

### `last`	

The `last` method will return the last document that matches the query.
It does so by sorting the query in descending order by the `_id` field and returning the first document of the result.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')

const result = query.last() // { _id: '...', name: 'John Doe' }
```

### `count`

The `count` method will return the number of documents that match the query.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')

const result = query.count() // 1
```
