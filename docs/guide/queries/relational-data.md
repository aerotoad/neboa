
# Relational Data

Relational data is a common requirement in many applications. Nebra provides a simple way to model and query relational data using lookups.
Lookups are a way to create nested queries that will be resolved when the parent query is executed and will populate the results with the resolved documents.

## Creating a relationship

You can create a relationship between two collections or documents using any field you want that can be queried with an `equalTo` constraint.
For the purpose of this guide, we will use the `_id` field.
All you need to do to create the relationship is to store the foreign field in your document so that it can be queried later.

As an example, let's create two collections, `users` and `posts`, and create a relationship between them, where a post belongs to a user.

```ts
const Users = db.collection('users')
const Posts = db.collection('posts')

const user = Users.insert({ name: 'John Doe' })
const post = Users.insert({
  title: 'Hello World',
  content: 'This is my first post',
  authorId: user._id
})
```
Now we have a relationship between the two collections. We can query the posts collection and populate the author field with the user document.\
We do this with the `lookup` method on the query instance.

If you want to create relationship one-to-many or many-to-many, you can simply store the foreign field as an array of acceptable values.
Let's add the list of posts to the user document.

```ts
Users.update(user._id, {
  postIds: [ post._id ]
})

// user: {
//   _id: '...',
//   name: 'John Doe',
//   postIds: [ '...' ]
// }
```

## Querying relationships

To query relationships, we can use the `lookup` method on the query instance.\
The lookup method accepts an options object as an argument.\
This options object has the following properties:

```ts
interface LookupOptions {
  from: string;         // The collection to lookup
  localField: string;   // The field on the current collection to match (array or value)
  foreignField: string; // The field on the other collection to match (array or value)
  as: string;           // The name of the field to populate
  limit?: number;       // The maximum number of documents to query
  skip?: number;        // The number of documents to skip
  sort?: SortOptions;   // The sort options (see below)
}

interface SortOptions {
  [key: string]: 'asc' | 'desc';  // The field to sort by and the sort order
}
```

Let's query the posts collection and populate the author field with the user document.

```ts
const posts = Posts.query()
  .lookup({
    from: 'users',
    localField: 'authorId',
    foreignField: '_id',
    as: 'author'
  })
  .find()
```
This will return an array of posts, where each post will have an `author` field populated with the user document.

```ts
const posts = [{
  _id: '...',
  title: 'Hello World',
  content: 'This is my first post',
  authorId: '...',
  author: {
    _id: '...',
    name: 'John Doe'
  }
}]
```

If we wanted to query the users collection and populate the posts field with the list of posts, we could do the following:

```ts
const users = Users.query()
  .lookup({
    from: 'posts',
    localField: 'postIds',
    foreignField: '_id',
    as: 'posts',
    sort: { 
      createdAt: 'desc' // Sort the posts by createdAt in descending order
    },  
    limit: 10,          // Only return the first 10 posts
  })
  .find()
```

This will return an array of users, where each user will have a `posts` field populated with the list of posts.

```ts
const users = [{
  _id: '...',
  name: 'John Doe',
  postIds: [ '...' ],
  posts: [{
    _id: '...',
    title: 'Hello World',
    content: 'This is my first post',
    authorId: '...'
  }]
}]
```

Since this modifies the original object stored in the database, you may want to account for this when modeling your interfaces to achieve type safety:

```ts
interface User {
  _id: string;
  name: string;
  postIds: string[];
  posts?: Post[]; // Optional (if we lookup the posts)
}
```

::: tip NOTE
Lookup queries are executed when the parent query is executed.\
They require additional queries to be executed, so they may be slower than normal queries and will impact performance if querying a large number of documents.
:::