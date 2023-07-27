import knex from "knex";
import { Collection } from "./collection";
import { LookupOptions } from "../types/lookup-options";
import { formatValue } from "../functions/format-value";

export class Query<T = any> {

  public _queryBuilder: any;

  public lookups: LookupOptions[] = [];

  constructor(
    private _knex: ReturnType<typeof knex>,
    private _collection: string
  ) {
    this._queryBuilder = this._knex(this._collection);
  }

  /**
   * Chainable query constraint methods
   * All methods return the query instance to allow chaining
   * All methods are chainable except for exec()
   * All methods use raw json_extract or .withJsonPath() to query json in the data column of the table
   */

  // Equality operators
  equalTo(field: string, value: any | any[]) {
    if (Array.isArray(value)) {
      this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') IN (${formatValue(value)})`);
    } else {
      this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') = ${formatValue(value)}`);
    }
    return this;
  }
  notEqualTo(field: string, value: any | any[]) {
    if (Array.isArray(value)) {
      this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') NOT IN (${formatValue(value)})`);
    } else {
      this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') != ${formatValue(value)}`);
    }
    return this;
  }

  // Comparison operators
  greaterThan(field: string, value: any) {
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') > ${formatValue(value)}`);
    return this;
  }
  greaterThanOrEqualTo(field: string, value: any) {
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') >= ${formatValue(value)}`);
    return this;
  }
  lessThan(field: string, value: any) {
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') < ${formatValue(value)}`);
    return this;
  }
  lessThanOrEqualTo(field: string, value: any) {
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') <= ${formatValue(value)}`);
    return this;
  }

  // Pagination operators
  limit(limit: number) {
    this._queryBuilder.limit(limit);
    return this;
  }
  skip(skip: number) {
    this._queryBuilder.offset(skip);
    return this;
  }
  first() {
    this._queryBuilder.limit(1);
    return this;
  }
  last() {
    this._queryBuilder.orderBy('id', 'desc').limit(1);
    return this;
  }

  // Sorting operators
  ascending(field: string) {
    this._queryBuilder.orderBy(this._knex.raw(`json_extract(data, '$.${field}')`) as any, 'asc');
    return this;
  }
  descending(field: string) {
    this._queryBuilder.orderBy(this._knex.raw(`json_extract(data, '$.${field}')`) as any, 'desc');
    return this;
  }

  // Array operators
  containedIn(field: string, values: any[]) {
    // Use json_each to iterate over the array and check if the value is contained in the array
    this._queryBuilder.whereExists(
      this._knex.raw(`SELECT 1 FROM json_each(data, '$.${field}') WHERE value IN (${formatValue(values)})`) as any
    );
    return this;
  }
  notContainedIn(field: string, values: any[]) {
    // Use json_each to iterate over the array and check if the value is contained in the array
    this._queryBuilder.whereNotExists(
      this._knex.raw(`SELECT 1 FROM json_each(data, '$.${field}') WHERE value IN (${formatValue(values)})`) as any
    );
    return this;
  }

  // Element operators
  exists(field: string) {
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') IS NOT NULL`);
    return this;
  }
  notExists(field: string) {
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') IS NULL`);
    return this;
  }

  // Evaluation operators (regex)
  matches(field: string, regex: RegExp) {
    // Use the REGEXP function to check if the field matches the regex
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') REGEXP '${regex.toString()}'`);
    return this;
  }
  doesNotMatch(field: string, regex: RegExp) {
    // Use the REGEXP function to check if the field matches the regex
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') NOT REGEXP '${regex.toString()}'`);
    return this;
  }

  // Logical operators
  or(query: Query) {
    const clone = query._queryBuilder.clone();
    const serialized = clone.toString();
    // Take everything after the first WHERE clause
    const whereClause = serialized.split('where ')[1];
    // Add the AND query to the original query
    this._queryBuilder.orWhere(this._knex.raw(`${whereClause}`));
    return this;
  }

  and(query: Query) {
    const clone = query._queryBuilder.clone();
    const serialized = clone.toString();
    // Take everything after the first WHERE clause
    const whereClause = serialized.split('where ')[1];
    // Add the AND query to the original query
    this._queryBuilder.andWhere(this._knex.raw(`${whereClause}`));
    return this;
  }

  // Search
  fullText(field: string, value: string) {
    this._queryBuilder.whereRaw(`json_extract(data, '$.${field}') LIKE '%${value}%'`);
    return this;
  }

  // Relational operators
  lookup(options: LookupOptions) {
    this.lookups.push(options);
    return this;
  }

  /**
   * Exec method
   * Executes the query and returns the documents
   */
  async exec(): Promise<Array<T>> {
    try {
      // Pluck only the data column from the query
      this._queryBuilder.queryContext({ parseColumn: 'data' });
      const documents = await this._queryBuilder;

      let result: Promise<any>[] = [];

      result = documents.map(async (document: { id: string, data: string }) => {
        const parsedDocument = JSON.parse(document.data);

        // Apply lookups
        for (let lookup of this.lookups) {
          const { from, localField, foreignField, as, limit, skip, sort } = lookup;
          const lookupCollection = new Collection(this._knex, from);
          const lookupQuery = lookupCollection.query();
          if (Array.isArray(parsedDocument[localField])) {
            lookupQuery.containedIn(foreignField, parsedDocument[localField]);
            if (limit) lookupQuery.limit(limit);
            if (skip) lookupQuery.skip(skip);
            if (sort) {
              Object.keys(sort).forEach((field) => {
                if (sort[field] === 'asc') lookupQuery.ascending(field);
                if (sort[field] === 'desc') lookupQuery.descending(field);
              });
            }
          } else {
            lookupQuery.equalTo(foreignField, parsedDocument[localField]);
          }

          parsedDocument[as] = await lookupQuery.exec();
        }
        return parsedDocument;
      });

      return await Promise.all(result);
    } catch (error) {
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      // Use a copy of the query builder to avoid modifying the original query
      const countQueryBuilder = this._queryBuilder.clone();
      // Count all the documents
      countQueryBuilder.count();
      const count = await countQueryBuilder;
      return count[0]['count(*)'];
    } catch (error) {
      throw error;
    }
  }

}
