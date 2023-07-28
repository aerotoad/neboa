import { describe, it, expect, expectTypeOf } from 'vitest';
import { Nebra } from '../../classes/nebra';
import { Collection } from '../../classes/collection';
import { Document as NebraDocument } from '../../types/document';
import { Query } from '../../classes/query';

describe('Collection class', () => {

  it('Should be able to create a new instance with required params', () => {
    const nebra = new Nebra(':memory:');
    const collection = new Collection(nebra.knex(), 'test');
    expect(collection).toBeInstanceOf(Collection);
  });

  it('Should be able to insert a document', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const inserted = await collection.insert({
      name: 'test'
    });

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NebraDocument<any>>();

    const knex = nebra.knex();
    const result = await knex('test').where('id', inserted._id);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(inserted._id);
    expect(JSON.parse(result[0].data).name).toBe('test');
  });

  it('Should be able to insert many documents', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const inserted = await collection.insertMany([
      {
        name: 'test'
      },
      {
        name: 'test2'
      }
    ]);

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NebraDocument<any>[]>();

    const knex = nebra.knex();
    const result = await knex('test');

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(JSON.parse(result[0].data).name).toBe('test');
    expect(JSON.parse(result[1].data).name).toBe('test2');
  });

  it('Should be able to update a document', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const inserted = await collection.insert({
      name: 'test'
    });

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NebraDocument<any>>();

    // Wait 100ms to ensure updatedAt is different
    await new Promise(resolve => setTimeout(resolve, 100));

    const updated = await collection.update(inserted._id, {
      name: 'test2'
    });

    expect(updated).toBeDefined();
    expectTypeOf(updated).toMatchTypeOf<NebraDocument<any>>();

    const knex = nebra.knex();
    const result = await knex('test').where('id', inserted._id);

    console.log(inserted);
    console.log(JSON.parse(result[0].data));

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(inserted._id);
    expect(JSON.parse(result[0].data).updatedAt).not.toBe(inserted.updatedAt);
    expect(JSON.parse(result[0].data).name).toBe('test2');
  });

  it('Should be able to update many documents', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const inserted = await collection.insertMany([
      {
        name: 'test'
      },
      {
        name: 'test2'
      }
    ]);

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NebraDocument<any>[]>();

    // Wait 100ms to ensure updatedAt is different
    await new Promise(resolve => setTimeout(resolve, 100));

    const updated = await collection.updateMany([inserted[0]._id, inserted[1]._id], [
      {
        ...inserted[0],
        name: 'test3'
      },
      {
        ...inserted[1],
        name: 'test4'
      }
    ]);

    expect(updated).toBeDefined();
    expectTypeOf(updated).toMatchTypeOf<NebraDocument<any>[]>();

    const knex = nebra.knex();
    const result = await knex('test');

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(JSON.parse(result[0].data).updatedAt).not.toBe(inserted[0].updatedAt);
    expect(JSON.parse(result[1].data).updatedAt).not.toBe(inserted[1].updatedAt);
    expect(JSON.parse(result[0].data).name).toBe('test3');
    expect(JSON.parse(result[1].data).name).toBe('test4');
  });

  it('Should be able to delete a document', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const inserted = await collection.insert({
      name: 'test'
    });

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NebraDocument<any>>();

    const deleted = await collection.delete(inserted);

    expect(deleted).toBeDefined();
    expect(deleted).toBe(true);

    const knex = nebra.knex();
    const result = await knex('test').where('id', inserted._id);

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  it('Should be able to delete many documents', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const inserted = await collection.insertMany([
      {
        name: 'test'
      },
      {
        name: 'test2'
      }
    ]);

    expect(inserted).toBeDefined();
    expectTypeOf(inserted).toMatchTypeOf<NebraDocument<any>[]>();

    const deleted = await collection.deleteMany(inserted);

    expect(deleted).toBeDefined();
    expect(deleted).toBe(true);

    const knex = nebra.knex();
    const result = await knex('test');

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  it('Should be able to start a new query', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const query = collection.query();
    expect(query).toBeDefined();
    expect(query).toBeInstanceOf(Query);
  });

});
