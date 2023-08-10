
# Creating Queries

Queries are the primary way of interacting with the database. \
They allow you to retrieve documents from the database with ease and efficiency, providing you with many different constraints and options.

## Basic Usage

To create a query, you can use the `query` method on the collection instance. \
This method will return a query instance, which is the base to build your query on.

```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

const Users = db.collection('users')

const query = Users.query()
```
After creating the query instance, you can chain methods to build your query before finally executing it with the `exec` method.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')

const result = query.exec()
```
Creating queries this way also allows you reuse the query instance, which can be useful in some cases.

Besides the `exec` method, you can also use the `count` method to count the number of documents that match the query.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')

const count = query.count() // 1
```
