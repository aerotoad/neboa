import RegexParser from 'regex-parser';
import { Collection } from './collection';
import Database, { Database as DatabaseConstructor } from 'better-sqlite3';

export class Nebra {

  private _database: DatabaseConstructor;

  /**
   * Create a new Nebra instance
   * @param path Path to the database file (e.g. `:memory:` or `./database.db`)
   * If :memory: is used, the database will be stored in memory and will not be persistent
   * This path is passed directly to the Knex instance and it uses the better-sqlite3 driver
   */
  constructor(path: string, options: {
    fileMustExist?: boolean;
    timeout?: number;
    nativeBinding?: string | undefined;
  } = {}) {
    this._database = new Database(path, options);
    this._database.function('regexp', { deterministic: true }, (regex: unknown, text: unknown) => {
      return RegexParser(regex as string).test(text as string) ? 1 : 0;
    });
  }

  /**
   * Authenticate to the database
   * Used to check if the database is accessible and working
   * @returns {boolean} True if authenticated
   * @throws {Error} If authentication fails
   * @example
  */
  authenticate(): boolean {
    try {
      //await this._knex.raw('SELECT 1 + 1 AS result');
      this._database.exec('SELECT 1 + 1 AS result');
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the underlying better-sqlite3 instance for direct interaction
   * @returns {DatabaseConstructor} The sqlite3 instance
   */
  connection(): DatabaseConstructor {
    return this._database;
  }

  /**
   * Access a collection or create it if it doesn't exist
   * @param name Collection name
   * @returns Collection instance
   */
  collection<T = Record<any, any>>(name: string): Collection<T> {
    try {
      const exists = this._database.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}';`).get();
      if (exists) {
        return new Collection<T>(this._database, name);
      } else {
        this._database.exec(`CREATE TABLE ${name} (id TEXT PRIMARY KEY, data JSON);`);
        return new Collection<T>(this._database, name);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Close the database connection
   * Once closed, the database cannot be accessed anymore until a new Nebra instance is created
   * @returns {boolean}
   * @throws {Error} If closing the connection fails
   */
  close(): boolean {
    try {
      //await this._knex.destroy();
      this._database.close();
      return true;
    } catch (error) {
      throw error;
    }
  }

}
