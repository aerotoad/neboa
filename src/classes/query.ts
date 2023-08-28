import { LookupOptions } from "../types/lookup-options";
import { formatValue } from "../functions/format-value";
import { Database } from "better-sqlite3";
import { QueryBuilder } from "./query-builder";
import { NeboaDocument } from '../types/neboa-document';

export class Query<T = any> {

  public _queryBuilder: QueryBuilder;

  public lookups: LookupOptions[] = [];

  constructor(
    private _database: Database,
    private _collection: string
  ) {
    this._queryBuilder = new QueryBuilder(this._database, this._collection);
  }

  /**
   * Chainable query constraint methods
   * All methods return the query instance to allow chaining
   * All methods are chainable except for find(), count(), first() and last()
   * All methods use raw json_extract or .withJsonPath() to query json in the data column of the table
   */

  // Equality operators (can be anything but object or array)
  equalTo(field: string, value: string | number | boolean | null) {
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value = ${formatValue(value)})
    `)
    return this;
  }


  notEqualTo(field: string, value: any | any[]) {
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value != ${formatValue(value)})
    `);
    return this;
  }

  // Comparison operators
  greaterThan(field: string, value: any) {
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value > ${formatValue(value)})
    `);
    return this;
  }
  greaterThanOrEqualTo(field: string, value: any) {
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value >= ${formatValue(value)})
    `);
    return this;
  }
  lessThan(field: string, value: any) {
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value < ${formatValue(value)})
    `);
    return this;
  }
  lessThanOrEqualTo(field: string, value: any) {
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value <= ${formatValue(value)})
    `);
    return this;
  }

  // Array operators
  containedIn(field: string, values: any[]) {
    // Use json_each to iterate over the array and check if the value is contained in the array
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value IN (${values.map((val) => formatValue(val)).join(',')}))
    `);
    return this;
  }
  notContainedIn(field: string, values: any[]) {
    // Use json_each to iterate over the array and check if the value is contained in the array
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value IN (${values.map((val) => formatValue(val)).join(',')})) IS NULL
    `);
    return this;
  }

  // Element operators
  exists(field: string) {
    this._queryBuilder.where(`
      JSON_EXTRACT(data, '$.${field}') IS NOT NULL
    `)
    return this;
  }
  notExists(field: string) {
    this._queryBuilder.where(`
      JSON_EXTRACT(data, '$.${field}') IS NULL
    `)
    return this;
  }

  // Evaluation operators (regex)
  matches(field: string, regex: RegExp) {
    // Use the REGEXP function to check if the field matches the regex
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value REGEXP '${regex.toString()}')
    `);
    return this;
  }
  doesNotMatch(field: string, regex: RegExp) {
    // Use the REGEXP function to check if the field matches the regex
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value REGEXP '${regex.toString()}') IS NULL
    `);
    return this;
  }

  // Logical operators
  or(query: Query) {
    const clone = query._queryBuilder.statement();
    const serialized = clone.toString();
    // Take everything after the first WHERE clause
    const whereClause = serialized.split('WHERE ')[1];
    // Add the AND query to the original query
    this._queryBuilder.or(`(${whereClause})`);
    return this;
  }

  and(query: Query) {
    const clone = query._queryBuilder.statement();
    const serialized = clone.toString();
    // Take everything after the first WHERE clause
    const whereClause = serialized.split('WHERE ')[1];
    // Add the AND query to the original query
    this._queryBuilder.and(`(${whereClause})`);
    return this;
  }

  // Search
  like(field: string, value: string) {
    this._queryBuilder.where(`
      (SELECT 1 FROM JSON_EACH(data, '$.${field}') WHERE value LIKE '%${value}%')
    `);
    return this;
  }

  // Relational operators
  lookup(options: LookupOptions) {
    this.lookups.push(options);
    return this;
  }

  // Pagination operators
  limit(limit: number) {
    this._queryBuilder.limit(limit);
    return this;
  }
  skip(skip: number) {
    this._queryBuilder.skip(skip);
    return this;
  }

  // Sorting operators
  ascending(field: string) {
    this._queryBuilder.sort(field, 'asc');
    return this;
  }
  descending(field: string) {
    this._queryBuilder.sort(field, 'desc');
    return this;
  }

  // Executes the query and returns the first document
  first(): NeboaDocument<T> {
    this._queryBuilder.limit(1);
    return this.find()[0];
  }

  // Executes the query and returns the last document
  last() {
    this._queryBuilder.sort('id', 'desc').limit(1);
    return this.find()[0];
  }

  /**
   * Find method
   * Executes the query and returns the documents as an array
   */
  find(): Array<NeboaDocument<T>> {
    try {
      // Get the docs
      const documents = this._queryBuilder.statement().all().map((doc: any) => {
        const parsedDocument = JSON.parse(doc.data);

        // Apply lookups
        for (let lookup of this.lookups) {
          const { from, localField, foreignField, as, limit, skip, sort } = lookup;
          //const lookupCollection = new Collection(this._knex, from);
          const lookupQuery = new Query(this._database, from);
          if (Array.isArray(parsedDocument[localField])) {
            lookupQuery.containedIn(foreignField, parsedDocument[localField]);
            if (limit) lookupQuery.limit(limit);
            if (skip) lookupQuery.skip(skip);
            if (sort) {
              Object.keys(sort).forEach((field) => {
                lookupQuery.ascending(field);
              });
            }
            const result = lookupQuery.find();
            parsedDocument[as] = result;
          } else {
            lookupQuery.equalTo(foreignField, parsedDocument[localField]);
            const result = lookupQuery.find();
            parsedDocument[as] = result;
          }
        }

        return parsedDocument;
      });

      return documents;
    } catch (error) {
      throw error;
    }
  }

  count(): number {
    try {
      return this._queryBuilder.count().pluck().get() as number;
    } catch (error) {
      throw error;
    }
  }

}
