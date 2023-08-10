import { describe, it, expect } from 'vitest';
import { Nebra } from '../../classes/nebra';

describe('Nebra class', () => {

  it('should be able to create a new instance', () => {
    const nebra = new Nebra(':memory:');
    expect(nebra).toBeInstanceOf(Nebra);
  });

  it('should be able to authenticate', async () => {
    const nebra = new Nebra(':memory:');
    const authenticated = await nebra.authenticate();
    expect(authenticated).toBe(true);
  });

  it('should have a working sqlite3 instance', async () => {
    const nebra = new Nebra(':memory:');
    const db = nebra.connection();
    const { result } = db.prepare('SELECT 1 + 1 AS result').get() as any;
    expect(result).toBe(2);
  });

  it('should be able to create a collection', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    expect(collection).toBeDefined();
    const db = nebra.connection();
    const exists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='test'`).pluck().get() as any;
    expect(exists).not.toBeUndefined();
  });

  it('should be able to access a collection', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const collection2 = await nebra.collection('test');
    expect(collection).toStrictEqual(collection2);
  });

  it('should be able to access a collection with a different name', async () => {
    const nebra = new Nebra(':memory:');
    const collection = await nebra.collection('test');
    const collection2 = await nebra.collection('test2');
    expect(collection).not.toStrictEqual(collection2);
  });

})
