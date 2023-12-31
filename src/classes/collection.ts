import ObjectID from 'bson-objectid';
import { Query } from './query';
import { NeboaDocument } from '../types/neboa-document';
import { Database } from 'better-sqlite3';
import { Emitter } from './emitter';
import { Subscription } from './subscription';

export class Collection<T = {}> {

  public _emitter: Emitter<Array<NeboaDocument<T>>> = new Emitter();

  constructor(
    private _database: Database,
    private _name: string
  ) { }

  /**
   * Creates a new query for the collection
   * @returns A new query instance
   */
  query() {
    return new Query<T>(this._database, this._name, this);
  }

  /**
   * Inserts a new document into the collection
   * @param document Document to insert
   * @returns The inserted document
   */
  insert(document: T): NeboaDocument<T> {
    try {
      const newDocument = this.newDocument(document);
      this._database.prepare(`
        INSERT INTO ${this._name} (id, data)
        VALUES (?, ?);
      `)
        .bind(newDocument._id, JSON.stringify(newDocument))
        .run();

      this._emitter.emit('create', [newDocument]);
      return newDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inserts multiple documents into the collection
   * @param documents Inserts multiple documents into the collection
   * @returns An array of inserted documents
   */
  insertMany(documents: T[]): NeboaDocument<T>[] {
    try {
      const newDocuments = documents.map(document => this.newDocument(document));

      const insertionData = newDocuments.map(document => ({
        id: document._id,
        data: JSON.stringify(document)
      }));

      // Initiate a transaction
      const transaction = this._database.transaction(() => {
        const stmt = this._database.prepare(`
          INSERT INTO ${this._name} (id, data)
          VALUES (?, ?);
        `);
        for (const data of insertionData) {
          stmt.run(data.id, data.data);
        }
      });

      // Run the transaction
      transaction();
      this._emitter.emit('create', [...newDocuments]);
      return newDocuments;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a document in the collection
   * @param document Document to update
   * @returns The updated document
   */
  update(objectId: string, document: T): NeboaDocument<T> {

    // Turn the recived document into a Document<T> object
    const updatedDocument: NeboaDocument<T> = {
      ...document,
      _id: objectId
    }

    try {

      const result = this._database.prepare(`
        UPDATE ${this._name}
        SET data = ?
        WHERE id = ?
        RETURNING *;
      `)
        .get(JSON.stringify(updatedDocument), objectId) as any;

      const updatedDocumentParsed = JSON.parse(result.data);
      this._emitter.emit('update', [updatedDocumentParsed]);
      return updatedDocumentParsed;
    } catch (error) {
      throw error;
    }

  }

  /**
   * Updates multiple documents in the collection
   * @param documents Array of documents to update
   * @returns An array of updated documents
   */
  updateMany(objectIds: string[], documents: T[]): NeboaDocument<T>[] {
    try {

      let updatedDocuments: NeboaDocument<T>[] = [];

      const transaction = this._database.transaction(() => {
        const stmt = this._database.prepare(`
          UPDATE ${this._name}
          SET data = ?
          WHERE id = ?
          RETURNING *;
        `);
        for (const [index, document] of documents.entries()) {

          // Turn the recived document into a Document<T> object
          const updatedDocument: NeboaDocument<T> = {
            ...document,
            _id: objectIds[index]
          }

          // Run the update statement and push the result to the updatedDocuments array
          const result = stmt.get(JSON.stringify(updatedDocument), objectIds[index]) as any;
          updatedDocuments.push(JSON.parse(result.data));
        }
      })

      // Run the transaction
      transaction();

      this._emitter.emit('update', updatedDocuments);
      return updatedDocuments;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a document from the collection
   * @param document Document to delete
   * @returns True if the document was deleted
   */
  delete(objectId: string): Boolean {
    try {
      this._database.prepare(`
        DELETE FROM ${this._name}
        WHERE id = '${objectId}';
      `).run();

      this._emitter.emit('delete', [{ _id: objectId } as NeboaDocument<T>]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes multiple documents from the collection
   * @param documents Array of documents to delete
   * @returns True if the documents were deleted
   */
  deleteMany(objectIds: string[]): Boolean {
    try {
      this._database.prepare(`
        DELETE FROM ${this._name}
        WHERE id IN (${objectIds.map(id => `'${id}'`).join(', ')});
      `).run();

      this._emitter.emit('delete', objectIds.map(id => ({ _id: id } as NeboaDocument<T>)));
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Drops the collection
   * This is a destructive operation and cannot be undone
   * It will remove the associated table from the database
   */
  drop(): boolean {
    try {
      this._database.prepare(`
        DROP TABLE ${this._name};
      `).run();
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Renames the collection
   * @param newName New name for the collection
   */
  rename(newName: string): boolean {
    try {
      this._database.prepare(`
        ALTER TABLE ${this._name}
        RENAME TO ${newName};
      `).run();
      return true;
    } catch (error) {
      throw error;
    }
  }

  private newDocument(document: T): NeboaDocument<T> {

    if (typeof document !== 'object') throw new Error('Document must be an object');
    if (Array.isArray(document)) throw new Error('Document cannot be an array');
    if (document === null) throw new Error('Document cannot be null');
    if (document === undefined) throw new Error('Document cannot be undefined');

    return {
      ...document,
      _id: ObjectID().toHexString(),
    } as NeboaDocument<T>;
  }

  subscribe(event: 'create' | 'update' | 'delete', callback: (documents: NeboaDocument<T>[] | string[]) => void) {
    return new Subscription<T>(event, 'collection', null, this, callback);
  }

}
