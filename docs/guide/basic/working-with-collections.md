
# Working with Collections

Collections are the main way to structure and store data in Nebra. \
Each collection is mapped to a table in the database, and each document is mapped to a row in that table.

Nebra only stores serialized data, therefore you don't need to worry about creating and maintaining table schemas yourself. \
You can just insert and retrieve data as you please.

## Creating a collection

You can create a collection by calling the `collection` method on the database instance. \
This method will accept the name of the collection as the argument and return a collection instance. \
If the collection doesn't exist in the database, it will be created automatically.
  
```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

const Users = db.collection('users')
```

## Inserting a document

To insert a document into a collection, you can use the `insert` method. \
This method will accept the document as the argument and return the inserted document.

```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

const Users = db.collection('users')

Users.insert({ name: 'John Doe', age: 42 })
```

## Inserting multiple documents

To insert multiple documents into a collection, you can use the `insertMany` method. \
It will accept an array of documents as the argument and return an array of the inserted documents.

```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

const Users = db.collection('users')

Users.insertMany([
  { name: 'John Doe', age: 42 },
  { name: 'Jane Doe', age: 42 }
])
```

## Collection and Document types

You can specify the type of the documents in the collection by passing a generic argument to the `collection` method. \
This will allow you to get type hints when working with documents in the collection.

```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

interface User {
  name: string
  age: number
}

const Users = db.collection<User>('users')

Users.insert({ name: 'John Doe', age: 42 }) // OK 👍
Users.insert({ name: 'John Doe' }) // Error ❌ - missing age

const query = Users.query()
query.equalTo('name', 'John Doe')
const user = query.exec(); // user is of type Document<User>
```

Documents retrieved from the database will be of type `Document<T>`, where `T` is the type of the collection. \
This type is just wrapper type around the document, which adds the timestamps and the `_id` field to the document.

This is how the `Document<T>` type is defined:

```ts
interface User {
  name: string
  age: number
}

type Document<T> = T & {
  _id: string
  createdAt: string
  updatedAt: string
}

// This results in the following type:
{
  name: string
  age: number
  _id: string
  createdAt: string
  updatedAt: string
}
```

## Updating documents

To update a document, you can use the `update` method. \
This method will accept an ObjectID as the first argument and the update as the second argument. \
It will return the updated document.

```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

const Users = db.collection('users')

const user = Users.insert({ name: 'John Doe', age: 42 })

Users.update(user._id, { age: 43 })
```

## Updating multiple documents

To update multiple documents, you can use the `updateMany` method. \
This method accepts an array of ObjectIDs as the first argument and an array of updates as the second argument.\
It will return an array of the updated documents.

```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

const Users = db.collection('users')

const users = Users.insertMany([
  { name: 'John Doe', age: 42 },
  { name: 'Jane Doe', age: 42 }
])

Users.updateMany(
  [ users[0]._id, users[1]._id ],
  [
    { age: 43 },
    { age: 43 }
  ]
)
```

## Deleting documents

To delete documents, you can make use of the `delete` and `deleteMany` methods. \
The `delete` method accepts an ObjectID as the argument and will delete the document with that ID. \
The `deleteMany` method accepts an array of ObjectIDs as the argument and will delete all documents with those IDs.

```ts
import { nebra } from 'nebra'

const db = nebra('database.db')

const Users = db.collection('users')

const user = Users.insert({ name: 'John Doe', age: 42 })

Users.delete(user._id)
```

## Querying documents

To query documents, you need to create a query instance on the collection. Queries are chainable and there are many methods available to build the query. \
Head over to the [Query](/guide/creating-queries) section to learn more about querying documents.





