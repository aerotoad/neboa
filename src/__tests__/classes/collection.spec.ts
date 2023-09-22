import { describe, it, expect, expectTypeOf } from 'vitest';
import { Neboa } from '../../classes/neboa';
import { Collection } from '../../classes/collection';
import { NeboaDocument } from '../../types/neboa-document';
import { Query } from '../../classes/query';

describe('Collection class', () => {

  it('Should be able to create a new instance with required params', () => {
    const neboa = new Neboa(':memory:');
    const collection = new Collection(neboa.connection(), 'test');
    expect(collection).toBeInstanceOf(Collection);
  });

  it('Should be able to insert a document', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const inserted = await collection.insert({
      name: 'test'
    });

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NeboaDocument<any>>();

    const db = neboa.connection();
    const result = db.prepare('SELECT * FROM test WHERE id = ?').get(inserted._id) as any;

    expect(result).toBeDefined();
    expect(result.id).toBe(inserted._id);
    expect(JSON.parse(result.data).name).toBe('test');
  });

  it('Should be able to insert many documents', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const inserted = await collection.insertMany([
      {
        name: 'test'
      },
      {
        name: 'test2'
      }
    ]);

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NeboaDocument<any>[]>();

    const db = neboa.connection();
    const result = db.prepare('SELECT * FROM test WHERE id IN (?, ?)').all(inserted.map((i: any) => i._id)) as any;

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(JSON.parse(result[0].data).name).toBe('test');
    expect(JSON.parse(result[1].data).name).toBe('test2');
  });

  it('Should be able to update a document', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const inserted = await collection.insert({
      name: 'test',
      updatedAt: new Date().toISOString()
    });

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NeboaDocument<any>>();

    // Wait 100ms to ensure updatedAt is different
    await new Promise(resolve => setTimeout(resolve, 100));

    const updated = await collection.update(inserted._id, {
      name: 'test2',
      updatedAt: new Date().toISOString()
    });

    expect(updated).toBeDefined();
    expectTypeOf(updated).toMatchTypeOf<NeboaDocument<any>>();

    const db = neboa.connection();
    const result = db.prepare('SELECT * FROM test WHERE id = ?').get(inserted._id) as any;

    expect(result).toBeDefined();
    expect(result.id).toBe(inserted._id);
    expect(JSON.parse(result.data).updatedAt).not.toBe(inserted.updatedAt);
    expect(JSON.parse(result.data).name).toBe('test2');

    // Query the collection to ensure the data is correctly updated
    const query = collection.query()
      .equalTo('_id', inserted._id)
      .first();

    expect(query).toBeDefined();
    expect(query._id).toBe(inserted._id);
  });

  it('Should be able to update many documents', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const inserted = await collection.insertMany([
      {
        name: 'test',
        updatedAt: new Date().toISOString()
      },
      {
        name: 'test2',
        updatedAt: new Date().toISOString()
      }
    ]);

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NeboaDocument<any>[]>();

    // Wait 100ms to ensure updatedAt is different
    await new Promise(resolve => setTimeout(resolve, 100));

    const updated = await collection.updateMany([inserted[0]._id, inserted[1]._id], [
      {
        name: 'test3',
        updatedAt: new Date().toISOString()
      },
      {
        name: 'test4',
        updatedAt: new Date().toISOString()
      }
    ]);

    expect(updated).toBeDefined();
    expectTypeOf(updated).toMatchTypeOf<NeboaDocument<any>[]>();

    const db = neboa.connection();
    const result = db.prepare('SELECT * FROM test WHERE id IN (?, ?)').all(inserted.map((i: any) => i._id)) as any;

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(JSON.parse(result[0].data).updatedAt).not.toBe(inserted[0].updatedAt);
    expect(JSON.parse(result[1].data).updatedAt).not.toBe(inserted[1].updatedAt);
    expect(JSON.parse(result[0].data).name).toBe('test3');
    expect(JSON.parse(result[1].data).name).toBe('test4');

    // Query the collection to ensure the data is correctly updated
    const query = collection.query()
      .containedIn('_id', [inserted[0]._id, inserted[1]._id])
      .find();

    expect(query).toBeDefined();
    expect(query[0]).toBeDefined();
    expect(query[1]).toBeDefined();
    expect(query[0]._id).toBe(inserted[0]._id);
    expect(query[1]._id).toBe(inserted[1]._id);
  });

  it('Should be able to delete a document', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const inserted = await collection.insert({
      name: 'test'
    });

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NeboaDocument<any>>();

    const deleted = await collection.delete(inserted._id);

    expect(deleted).toBeDefined();
    expect(deleted).toBe(true);

    const db = neboa.connection();
    const result = db.prepare('SELECT * FROM test WHERE id = ?').all(inserted._id) as any;

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  it('Should be able to delete many documents', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const inserted = await collection.insertMany([
      {
        name: 'test'
      },
      {
        name: 'test2'
      }
    ]);

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NeboaDocument<any>[]>();

    const deleted = await collection.deleteMany(inserted.map((i: any) => i._id));

    expect(deleted).toBeDefined();
    expect(deleted).toBe(true);

    const db = neboa.connection();
    const result = db.prepare('SELECT * FROM test WHERE id IN (?, ?)').all(inserted.map((i: any) => i._id)) as any;

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  it('Should be able to start a new query', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const query = collection.query();
    expect(query).toBeDefined();
    expect(query).toBeInstanceOf(Query);
  });

});
