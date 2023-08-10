
# Query Constraints

When building queries, Nebra provides you with many different constraints to filter documents.\
These constraints are chainable and can be used to build complex queries.

Here we will go over all the constraints available to you and how to use them.

## `equalTo`

The `equalTo` constraint allows you to filter documents by a specific value in a field.

```ts
const query = Users.query()
  .equalTo('name', 'John Doe')
  .equalTo('age', 42)
```

### Array values

When using the `equalTo` constraint on an array field, it will check if the array contains the value.

```ts
const query = Users.query()
  .equalTo('tags', 'foo')
```

## `notEqualTo`

The `notEqualTo` constraint allows you to filter documents by a value that is not equal to a specific value in a field.

```ts
const query = Users.query()
  .notEqualTo('name', 'John Doe')
  .notEqualTo('age', 42)
```

### Array values

When using the `notEqualTo` constraint on an array field, it will check if the array does not contain the value.

```ts
const query = Users.query()
  .notEqualTo('tags', 'foo')
```

## `greaterThan`

The `greaterThan` constraint allows you to filter documents by a value that is greater than a specific value in a field.

```ts
const query = Users.query()
  .greaterThan('age', 42)
```

## `greaterThanOrEqualTo`

The `greaterThanOrEqualTo` constraint allows you to filter documents by a value that is greater than or equal to a specific value in a field.

```ts
const query = Users.query()
  .greaterThanOrEqualTo('age', 42)
```

## `lessThan`

The `lessThan` constraint allows you to filter documents by a value that is less than a specific value in a field.

```ts
const query = Users.query()
  .lessThan('age', 42)
```

## `lessThanOrEqualTo`

The `lessThanOrEqualTo` constraint allows you to filter documents by a value that is less than or equal to a specific value in a field.

```ts
const query = Users.query()
  .lessThanOrEqualTo('age', 42)
```

## `containedIn`

The `containedIn` constraint is very similar to the `equalTo` constraint, but it allows you to filter documents by a value that is contained in an array field.

```ts
const query = Users.query()
  .containedIn('tags', ['foo', 'bar'])
```

## `notContainedIn`

The `notContainedIn` constraint is very similar to the `notEqualTo` constraint, but it allows you to filter documents by a value that is not contained in an array field.

```ts
const query = Users.query()
  .notContainedIn('tags', ['foo', 'bar'])
```

## `exists`

The `exists` constraint allows you to filter documents by a field that exists or does not exist.

```ts
const query = Users.query()
  .exists('name')
```

## `notExists`

The `notExists` constraint allows you to filter documents by a field that does not exist or exists.

```ts
const query = Users.query()
  .notExists('name')
```

## `matches`

The `matches` constraint allows you to filter documents by a field that matches a regular expression.

```ts
const query = Users.query()
  .matches('name', /^John/)
```

## `doesNotMatch`

The `doesNotMatch` constraint allows you to filter documents by a field that does not match a regular expression.

```ts
const query = Users.query()
  .doesNotMatch('name', /^John/)
```

## `fullText`

SQLite does not have a built-in full-text search feature, but Nebra uses the LIKE operator to provide a basic full-text search feature.

```ts
const query = Users.query()
  .fullText('name', 'John') // LIKE '%John%'
```

## `limit`

The `limit` constraint allows you to limit the number of documents returned by the query.

```ts
const query = Users.query()
  .limit(10)
```

## `skip`

The `skip` constraint allows you to skip a number of documents returned by the query.

```ts
const query = Users.query()
  .skip(10)
```

## `ascending`

The `ascending` constraint allows you to sort documents in ascending order by a field.

```ts
const query = Users.query()
  .ascending('name')
```

## `descending`

The `descending` constraint allows you to sort documents in descending order by a field.

```ts
const query = Users.query()
  .descending('name')
```

## `and`

The `and` constraint allows you to combine multiple constraints together.

```ts
const query1 = Users.query()
  .equalTo('name', 'John Doe')
  .equalTo('age', 42)

const query2 = Users.query()
  .greaterThan('score', 100)
  .and(query1) // (score > 100) AND (name = 'John Doe' AND age = 42)
```

## `or`

The `or` constraint allows you to combine multiple constraints together.

```ts
const query1 = Users.query()
  .equalTo('name', 'John Doe')
  .equalTo('age', 42)

const query2 = Users.query()
  .greaterThan('score', 100)
  .or(query1) // (score > 100) OR (name = 'John Doe' AND age = 42)
```

## `lookup`

The `lookup` constraint allows you to lookup documents in another collection.

```ts
const query = Users.query()
  .lookup({...})
```
The lookup method is used for relational data and more complex than the others, therefore it has its own section [here](./relational-data).



