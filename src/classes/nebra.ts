import knex from 'knex';
import RegexParser from 'regex-parser';
import { Collection } from './collection';

export class Nebra {

  private _knex: ReturnType<typeof knex>;

  constructor(path: string) {
    this._knex = knex({
      client: 'better-sqlite3',
      connection: {
        filename: path
      },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn: any, done: any) => {
          conn.function('regexp', { deterministic: true }, (regex: string, text: string) => {
            return RegexParser(regex).test(text) ? 1 : 0;
          });
          conn.function('from_array', { deterministic: true }, (array: string) => {
            return JSON.parse(array);
          });
          done(null, conn);
        }
      }
    });
  }

  async authenticate() {
    try {
      await this._knex.raw('SELECT 1 + 1 AS result');
      return true;
    } catch (error) {
      throw error;
    }
  }

  async collection<T = any>(name: string): Promise<Collection<T>> {
  async collection<T = Record<any, any>>(name: string): Promise<Collection<T>> {
    try {
      const exists = await this._knex.schema.hasTable(name);
      if (exists) {
        return new Collection<T>(this._knex, name);
      } else {
        await this._knex.schema.createTable(name, (table) => {
          table.string('id').primary();
          table.json('data');
        });
        return new Collection<T>(this._knex, name);
      }
    } catch (error) {
      throw error;
    }
  }

}
