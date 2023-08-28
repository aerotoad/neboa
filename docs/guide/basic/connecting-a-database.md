
# Connecting a Database

To connect to a database (or create one if it doesn't exist), you must first create a new instance of Neboa.\
This is done by calling the `neboa` function with the path to the database file.

```ts
import { neboa } from 'neboa'

const db = neboa('path/to/database.db')
```

Alternatively, you can use an in-memory database by passing `:memory:` as the path.

```ts
import { neboa } from 'neboa'

const db = neboa(':memory:')
```
Using an in-memory database is useful for testing, but it's not recommended for production.
It will provide you with a fresh database every time you run your program, and it will be deleted when the program exits.

## Configuration

The neboa function accepts an optional configuration object as the second argument. It can be used to configure the underlying 
[better-sqlite3](https://github.com/WiseLibs/better-sqlite3) instance.
The configuration object will be passed directly to the better-sqlite3 constructor and has the following signature:

```ts
interface DatabaseOptions {
  fileMustExist?: boolean;
  timeout?: number;
  nativeBinding?: string | undefined;
}
```
You can configure your connection by passing it to neboa like this:

```ts
import { neboa } from 'neboa'

const db = neboa('path/to/database.db', {
  fileMustExist: true,
  timeout: 5000
})
```

## Testing the connection

You can test if the connection was successful and the database is ready by calling the `authenticate` method.

```ts
import { neboa } from 'neboa'

const db = neboa('path/to/database.db')

db.authenticate() // Returns true if the connection was successful
```

## Closing the connection

You can close the connection to the database by calling the `close` method.

```ts
import { neboa } from 'neboa'

const db = neboa('path/to/database.db')

db.close() // Closes the connection
```

::: tip NOTE
Once the connection is closed, you can't use the database anymore. \
You will have to create a new instance of Neboa to connect to the database again.
:::

Once you have your database instance ready, you can start working with collections. \
Head over to the [Collections](/guide/basic/working-with-collections) section to learn more.
