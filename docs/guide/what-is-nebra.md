
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

### Does it scale?
On a single machine, yes. SQLite is a great choice for small to medium sized projects, but it does not scale horizontally. 
If you need to scale horizontally, you should look into other full-blown DBMS like [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/) or [MongoDB](https://www.mongodb.com/).
Most of the time, you won't need to handle multiple machines, so SQLite is a great choice.

If you're using Nebra in an Electron app, you won't need to worry about scaling and there are just a few other options out there that are as lightweight and easy to use as Nebra.