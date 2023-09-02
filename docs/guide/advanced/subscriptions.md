# Subscriptions

Subscriptions are a way to listen to changes in your database.
They can be used both in collections and specific queries and are very useful for real-time applications.

::: tip Note
This section assumes you already have a basic understanding of how to use [collections](/guide/basic/collections) and [queries](/guide/queries/creating-queries).
:::

## Subscribing to a collection

After creating a collection, you can subscribe to it using the `subscribe` method.
This method accepts a string as the first argument to determine what event to listen to, and a callback function as the second argument.

```ts
import { neboa, NeboaDocument } from 'neboa';

const db = neboa(':memory:'); // Create a new database in memory

const Users = db.collection('users'); // Create a new collection

Users.subscribe('create', (user: NeboaDocument<{}>[]) => {
  console.log('A new user was created!', user);
})
```

The event types supported are:

- `create`: Triggered when a new document is created.
- `update`: Triggered when a document is updated.
- `delete`: Triggered when a document is deleted.

The callback receives an array of documents that were affected by the event, except for the `delete` event, which receives an array of the deleted ObjectId's.

Calling the `subscribe` method returns a subscription instance that can be used to unsubscribe from the event.

```ts
const subscription = Users.subscribe('create', (user: NeboaDocument<{}>[]) => {
  console.log('A new user was created!', user);
})
// Unsubscribe from the event
subscription.unsubscribe();
```

## Subscribing to a query

It's also possible to subscribe to a specific query.
This is useful when you want to listen to changes in a specific subset of documents.

SQLite doesn't have a built-in way to listen to changes in a query, so Neboa uses custom event handlers to achieve this without creating custom tables or triggers.

To create a subscription to a query, it's as simple as calling the `subscribe` method on the query instance.

```ts
const query = Users.query()
  .greaterThan('age', 18)
  .lessThan('age', 30);

query.subscribe('create', (user: NeboaDocument<{}>[]) => {
  console.log('A new user was created!', user);
});
```

The event types supported are the same as in collections: `create`, `update` and `delete`. And the callback receives the same arguments as well (an array of documents or ObjectId's).

You can also unsubscribe from the event by calling the `unsubscribe` method on the query instance.

The `update` event is triggered when an update of one or more documents in the collection matches the query. This also includes documents that were not previously matched by the query but now do and therefore will be included in the query results.

A full example of subscribing to a query would be:

```ts
const query = Users.query()
  .greaterThan('age', 18)
  .lessThan('age', 30);

query.subscribe('create', (user: NeboaDocument<{}>[]) => {
  console.log('A new user was created!', user);
});

query.subscribe('update', (user: NeboaDocument<{}>[]) => {
  console.log('A user was updated!', user);
});

query.subscribe('delete', (user: string[]) => {
  console.log('A user was deleted!', user);
});
```

## How do query subscriptions work?

When you subscribe to a query, Neboa will create a custom event handler inside the collection that gets notified when the event you subscribed to is triggered.

When the event is triggered, Neboa will run the query again adding an extra condition to the query to only return documents that were affected by the event, therefore returning only the documents that match the query and were affected by the event.

This means that if you subscribe to a query and then update or create a document that doesn't match the query, the event won't be triggered but the query will be run again anyway.

Take this into account when using query subscriptions, as it can have a performance impact if you're updating a lot of documents on a collection with many subscribed queries.