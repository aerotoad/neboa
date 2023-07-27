import knex from 'knex';
import RegexParser from 'regex-parser';
import { Collection } from './collection';

export class Nebra {

  private _knex: ReturnType<typeof knex>;

  /**
   * Create a new Nebra instance
   * @param path Path to the database file (e.g. `:memory:` or `./database.db`)
   * If :memory: is used, the database will be stored in memory and will not be persistent
   * This path is passed directly to the Knex instance and it uses the better-sqlite3 driver
   */
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

  /**
   * Authenticate to the database
   * Used to check if the database is accessible and working
   * @returns {Promise<boolean>} True if authenticated
   * @throws {Error} If authentication fails
   * @example
  */
  async authenticate() {
    try {
      await this._knex.raw('SELECT 1 + 1 AS result');
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Access a collection or create it if it doesn't exist
   * @param name Collection name
   * @returns Collection instance
   */
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

  /**
   * Access the Knex instance directly
   * (Caution: You can break things with this, use at your own risk)
   * Can be used for migrations, etc.
   * @returns {ReturnType<typeof knex>} Knex instance
   */
  knex(): ReturnType<typeof knex> {
    return this._knex;
  }

}
