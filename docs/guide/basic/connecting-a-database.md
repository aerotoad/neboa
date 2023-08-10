
# Connecting a Database

To connect to a database (or create one if it doesn't exist), you must first create a new instance of Nebra.\
This is done by calling the `nebra` function with the path to the database file.

```ts
import { nebra } from 'nebra'

const db = nebra('path/to/database.db')
```

Alternatively, you can use an in-memory database by passing `:memory:` as the path.

```ts
import { nebra } from 'nebra'

const db = nebra(':memory:')
```
Using an in-memory database is useful for testing, but it's not recommended for production.
It will provide you with a fresh database every time you run your program, and it will be deleted when the program exits.

## Testing the connection

You can test if the connection was successful and the database is ready by calling the `authenticate` method.

```ts
import { nebra } from 'nebra'

const db = nebra('path/to/database.db')

db.authenticate() // Returns true if the connection was successful
```

## Closing the connection

You can close the connection to the database by calling the `close` method.

```ts
import { nebra } from 'nebra'

const db = nebra('path/to/database.db')

db.close() // Closes the connection
```

::: tip NOTE
Once the connection is closed, you can't use the database anymore. \
You will have to create a new instance of Nebra to connect to the database again.
:::

Once you have your database instance ready, you can start working with collections. \
Head over to the [Collections](/guide/working-with-collections) section to learn more.
