import knex from 'knex';
import ObjectID from 'bson-objectid';
import { Query } from './query';
import { Document } from '../types/document';
import assert from 'node:assert';

export class Collection<T = {}> {

  constructor(
    private _knex: ReturnType<typeof knex>,
    private _name: string
  ) { }

  /**
   * Creates a new query for the collection
   * @returns A new query instance
   */
  query() {
    return new Query<T>(this._knex, this._name);
  }

  /**
   * Inserts a new document into the collection
   * @param document Document to insert
   * @returns A promise that resolves to the inserted document
   */
  async insert(document: T): Promise<Document<T>> {
    try {
      const newDocument = this.newDocument(document);
      const result = await this._knex(this._name).insert({
        id: newDocument._id,
        data: newDocument
      }).returning('data');
      return JSON.parse(result[0]?.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inserts multiple documents into the collection
   * @param documents Inserts multiple documents into the collection
   * @returns A promise that resolves to an array of inserted documents
   */
  async insertMany(documents: T[]): Promise<Document<T>[]> {
    try {
      const newDocuments = documents.map(document => this.newDocument(document));

      const insertionData = newDocuments.map(document => ({
        id: document._id,
        data: JSON.stringify(document)
      }));

      const result = await this._knex(this._name).insert(insertionData).returning('data');
      return result.map((obj: { id: string, data: string }) => {
        const document = JSON.parse(obj?.data);
        return document;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a document in the collection
   * @param document Document to update
   * @returns A promise that resolves to the updated document
   */
  async update(document: Document<T>): Promise<Document<T>> {
    document.updatedAt = new Date().toISOString();
    const result = await this._knex(this._name).where('id', document._id).update({
      data: JSON.stringify(document)
    }).returning('data');

    return JSON.parse(result[0]?.data);
  }

  /**
   * Updates multiple documents in the collection
   * @param documents Array of documents to update
   * @returns A promise that resolves to an array of updated documents
   */
  async updateMany(documents: Document<T>[]): Promise<Document<T>[]> {
    try {
      const newDocuments = documents.map(document => {
        document.updatedAt = new Date().toISOString();
        return document;
      });

      // Create a new transaction
      const trx = await this._knex.transaction();

      // Update each document
      const result = await Promise.all(newDocuments.map(document => {
        return trx(this._name).where('id', document._id).update({
          data: JSON.stringify(document)
        }).returning('data');
      }));

      // Commit the transaction
      await trx.commit();

      // Return the updated documents
      return result[0].map((obj: { id: string, data: string }) => {
        const document = JSON.parse(obj?.data);
        return document;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a document from the collection
   * @param document Document to delete
   * @returns A promise that resolves to true if the document was deleted
   */
  async delete(document: Document<T>): Promise<Boolean> {
    try {
      await this._knex(this._name).where('id', document._id).del();
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes multiple documents from the collection
   * @param documents Array of documents to delete
   * @returns A promise that resolves to true if the documents were deleted
   */
  async deleteMany(documents: Document<T>[]): Promise<Boolean> {
    try {
      await this._knex(this._name).whereIn('id', documents.map(document => document._id)).del();
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
  drop(): Promise<void> {
    return this._knex.schema.dropTable(this._name)
  }

  /**
   * Renames the collection
   * @param newName New name for the collection
   */
  rename(newName: string): Promise<void> {
    return this._knex.schema.renameTable(this._name, newName);
  }

  private newDocument(document: T): Document<T> {

    assert(typeof document === 'object', 'Document must be an object');
    assert(!Array.isArray(document), 'Document cannot be an array');
    assert(document !== null, 'Document cannot be null');
    assert(document !== undefined, 'Document cannot be undefined');
    assert(Object.hasOwnProperty.call(document, '_id') === false, 'Document cannot have _id property');
    assert(Object.hasOwnProperty.call(document, 'createdAt') === false, 'Document cannot have createdAt property');
    assert(Object.hasOwnProperty.call(document, 'updatedAt') === false, 'Document cannot have updatedAt property');

    return {
      ...document,
      _id: ObjectID().toHexString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Document<T>;
  }

}
