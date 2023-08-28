
# What is Neboa

Neboa (pronounced /ˈnɛβo̯a̝/, [from Galician](https://en.wiktionary.org/wiki/n%C3%A9boa#Galician): «fog») is a simple, yet powerful, type-safe NoSQL database library for Node.js.
It is built on top of [SQLite](https://www.sqlite.org/index.html) with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
It offers seamless data managment with compile-time type checking and a seamless query API.

Leveraging the power of SQLite, Neboa ensures efficient and lightweight performance, making it ideal for small to medium sized projects, to be used in Electron apps, or to be used as a local database for a web app or your next prototype.

<div class="tip custom-block" style="padding-top: 8px">

Just want to try it out? Skip to the [Quickstart](./getting-started).

</div>

## Use Cases

Neboa is ideal for:

- **Electron apps** - Neboa is a great choice for Electron apps, as it is lightweight and easy to use. Since it's built on top of SQLite it can be embedded in your app, and it's also a great choice for storing user data without dealing with the complexities of a full-blown relational database.
- **Small to medium sized projects** - Neboa is a great choice for small to medium sized projects, bear in mind that it inherits the limitations of SQLite like the lack of horizontal scaling. And while Neboa has support for relational data, relational queries do take a performance hit.

## FAQ

### Does Neboa support TypeScript?
Yes, Neboa is written in TypeScript and has full support for it, we encourage you to use TypeScript with Neboa.

### Does Neboa support relational data?
Yes, Neboa has support for relational data, you can read more about it [here](./queries/relational-data.md).
Nevertheless, relational queries do take a performance hit and are not the main strength of Neboa or NoSQL databases in general.
If you're looking for a heavy focus on relational data, you should look into other full-blown DBMS.

### What is SQLite?
SQLite is a relational database management system (RDBMS) that is embedded into the end program. It is a self-contained, serverless, zero-configuration, transactional SQL database engine. SQLite is the most used database engine in the world.

### What types of data can I store with Neboa?
Everything that can be serialized to and from JSON, which is basically everything. You can store strings, numbers, booleans, arrays, objects, dates, buffers, etc.
Bear in mind that complex data types like dates and buffers are stored as strings, so you won't be able to query them. \
Data is serialized with `JSON.stringify` before being stored and deserialized with `JSON.parse` when being retrieved.

### Does Neboa support encryption?
No, Neboa does not support encryption and it's not within the scope of the project for now.

### Does Neboa support multiple machines?
No, Neboa does not support multiple machines and it's not within the scope of the project for now.

### Does it scale?
On a single machine, yes. SQLite is a great choice for small to medium sized projects, but it does not scale horizontally. 
If you need to scale horizontally, you should look into other full-blown DBMS like [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/) or [MongoDB](https://www.mongodb.com/).
Most of the time, you won't need to handle multiple machines, so SQLite is a great choice.

If you're using Neboa in an Electron app, you won't need to worry about scaling and there are just a few other options out there that are as lightweight and easy to use as Neboa.