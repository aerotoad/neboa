import knex from 'knex';
import ObjectID from 'bson-objectid';
import { Query } from './query';
import { Document } from '../types/document';
import assert from 'node:assert';

export class Collection<T = Record<any, any>> {

  constructor(
    private _knex: ReturnType<typeof knex>,
    private _name: string
  ) { }

  query() {
    return new Query<T>(this._knex, this._name);
  }

  async insert(document: T): Promise<string> {
    try {
      const newDocument = this.newDocument(document);
      const result = await this._knex(this._name).insert({
        id: newDocument._id,
        data: newDocument
      }).returning('id');
      return result[0]?.id;
    } catch (error) {
      throw error;
    }
  }

  async insertMany(documents: T[]): Promise<string[]> {
    try {
      const newDocuments = documents.map(document => this.newDocument(document));

      const insertionData = newDocuments.map(document => ({
        id: document._id,
        data: JSON.stringify(document)
      }));

      const result = await this._knex(this._name).insert(insertionData).returning('id');
      return result.map(obj => obj?.id);
    } catch (error) {
      throw error;
    }
  }

  async update(document: Document<T>): Promise<string> {
    document.updatedAt = new Date().toISOString();
    const result = await this._knex(this._name).where('id', document._id).update({
      data: document
    }).returning('id');

    return result[0]?.id;
  }

  async updateMany(documents: Document<T>[]): Promise<string[]> {
    try {
      const newDocuments = documents.map(document => {
        document.updatedAt = new Date().toISOString();
        return document;
      });

      const result = await this._knex(this._name).update(
        newDocuments.map(document => ({
          data: document
        }))
      ).returning('id');

      return result.map((obj) => obj?.id);

    } catch (error) {
      throw error;
    }
  }

  drop(): Promise<void> {
    return this._knex.schema.dropTable(this._name)
  }

  rename(newName: string): Promise<void> {
    return this._knex.schema.renameTable(this._name, newName);
  }

  newDocument(document: T): Document<T> {

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
