import { describe, it, expect } from 'vitest';
import { Neboa } from '../../classes/neboa';

describe('Neboa class', () => {

  it('should be able to create a new instance', () => {
    const neboa = new Neboa(':memory:');
    expect(neboa).toBeInstanceOf(Neboa);
  });

  it('should be able to authenticate', async () => {
    const neboa = new Neboa(':memory:');
    const authenticated = await neboa.authenticate();
    expect(authenticated).toBe(true);
  });

  it('should have a working sqlite3 instance', async () => {
    const neboa = new Neboa(':memory:');
    const db = neboa.connection();
    const { result } = db.prepare('SELECT 1 + 1 AS result').get() as any;
    expect(result).toBe(2);
  });

  it('should be able to create a collection', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    expect(collection).toBeDefined();
    const db = neboa.connection();
    const exists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='test'`).pluck().get() as any;
    expect(exists).not.toBeUndefined();
  });

  it('should be able to access a collection', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const collection2 = await neboa.collection('test');
    expect(collection).toStrictEqual(collection2);
  });

  it('should be able to access a collection with a different name', async () => {
    const neboa = new Neboa(':memory:');
    const collection = await neboa.collection('test');
    const collection2 = await neboa.collection('test2');
    expect(collection).not.toStrictEqual(collection2);
  });

})
