
# What is Nebra

Nebra (pronounced /ˈnɛβɾa̝/, from Galician: «fog») is a simple, yet powerful, type-safe NoSQL database library for Node.js.
It is built on top of [SQLite](https://www.sqlite.org/index.html) with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
It offers seamless data managment with compile-time type checking and a seamless query API.

Leveraging the power of SQLite, Nebra ensures efficient and lightweight performance, making it ideal for small to medium sized projects, to be used in Electron apps, or to be used as a local database for a web app or your next prototype.

<div class="tip custom-block" style="padding-top: 8px">

Just want to try it out? Skip to the [Quickstart](./getting-started).

</div>

## Use Cases

Nebra is ideal for:

- **Electron apps** - Nebra is a great choice for Electron apps, as it is lightweight and easy to use. Since it's built on top of SQLite it can be embedded in your app, and it's also a great choice for storing user data without dealing with the complexities of a full-blown relational database.
- **Small to medium sized projects** - Nebra is a great choice for small to medium sized projects, bear in mind that it inherits the limitations of SQLite like the lack of horizontal scaling. And while Nebra has support for relational data, relational queries do take a performance hit.

## FAQ

### Does Nebra support TypeScript?
Yes, Nebra is written in TypeScript and has full support for it, we encourage you to use TypeScript with Nebra.

### Does Nebra support relational data?
Yes, Nebra has support for relational data, you can read more about it [here](./guide/relational-data).
Nevertheless, relational queries do take a performance hit and are not the main strength of Nebra or NoSQL databases in general.
If you're looking for a heavy focus on relational data, you should look into other full-blown DBMS.

### What is SQLite?
SQLite is a relational database management system (RDBMS) that is embedded into the end program. It is a self-contained, serverless, zero-configuration, transactional SQL database engine. SQLite is the most used database engine in the world.

### What types of data can I store with Nebra?
Everything that can be serialized to and from JSON, which is basically everything. You can store strings, numbers, booleans, arrays, objects, dates, buffers, etc.
Bear in mind that complex data types like dates and buffers are stored as strings, so you won't be able to query them. \
Data is serialized with `JSON.stringify` before being stored and deserialized with `JSON.parse` when being retrieved.

### Does Nebra support encryption?
No, Nebra does not support encryption and it's not within the scope of the project for now.

### Does Nebra support multiple machines?
No, Nebra does not support multiple machines and it's not within the scope of the project for now.

### Does it scale?
On a single machine, yes. SQLite is a great choice for small to medium sized projects, but it does not scale horizontally. 
If you need to scale horizontally, you should look into other full-blown DBMS like [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/) or [MongoDB](https://www.mongodb.com/).
Most of the time, you won't need to handle multiple machines, so SQLite is a great choice.

If you're using Nebra in an Electron app, you won't need to worry about scaling and there are just a few other options out there that are as lightweight and easy to use as Nebra.