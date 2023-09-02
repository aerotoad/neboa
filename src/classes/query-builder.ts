import { Database, Statement } from "better-sqlite3";

export class QueryBuilder {

  private _query = '';
  private _openingStatement: string;
  private _limitValue: number | undefined;
  private _skipValue: number | undefined;

  constructor(
    private _database: Database,
    private _collection: string
  ) {
    this._openingStatement = `SELECT * FROM ${this._collection} WHERE 1=1 `;
  }

  where(statement: string) {
    this._query += ` AND ${statement}`;
    return this;
  }

  or(statement: string) {
    this._query += ` OR WHERE ${statement}`;
    return this;
  }

  and(statement: string) {
    this._query += ` AND ${statement}`;
    return this;
  }

  limit(limit: number) {
    this._limitValue = limit;
    return this;
  }

  skip(skip: number) {
    this._skipValue = skip;
    return this;
  }

  sort(field: string, direction: 'asc' | 'desc' = 'asc') {
    this._query += ` ORDER BY JSON_EXTRACT(data, '$.${field}') ${direction}`;
    return this;
  }

  statement(): Statement {
    const query = this._openingStatement + this._query + ` LIMIT ${this._limitValue || -1} OFFSET ${this._skipValue || -1}`;
    return this._database.prepare(query);
  }

  count(): Statement {
    const openingStatement = `SELECT COUNT(*) FROM ${this._collection} WHERE 1=1 `;
    const query = openingStatement + this._query + ` LIMIT ${this._limitValue || -1} OFFSET ${this._skipValue || -1}`;
    return this._database.prepare(query);
  }

  toString() {
    return this._openingStatement + this._query;
  }

  clone() {
    const clone = new QueryBuilder(this._database, this._collection);
    clone._openingStatement = this._openingStatement;
    clone._query = this._query;
    clone._limitValue = this._limitValue;
    clone._skipValue = this._skipValue;
    return clone;
  }

}
