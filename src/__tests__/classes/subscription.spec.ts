import { describe, expect, it, vi } from "vitest";
import { Subscription } from "../../classes/subscription";
import { neboa } from "../../functions/neboa";

describe('Subscription class', () => {

  // Required db connection
  const db = neboa(':memory:');

  // Required collections
  const Collection1 = db.collection('collection1');

  it('Should create an instance of Subscription with the required methods', () => {
    const subscription = new Subscription('create', 'collection', null, Collection1, () => { });

    expect(subscription).toBeInstanceOf(Subscription);
    expect(subscription).toHaveProperty('unsubscribe');

    subscription.unsubscribe();
  });

  it('Should create a collection subscription and call the callback when the create event is emitted', () => {
    const callback = vi.fn();
    const updateCallback = vi.fn();
    const deleteCallback = vi.fn();

    const subscription = new Subscription('create', 'collection', null, Collection1, callback);

    Collection1.insert({ name: 'test' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ _id: expect.any(String), name: 'test' }]);
    expect(updateCallback).not.toHaveBeenCalled();
    expect(deleteCallback).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('Should create a collection subscription and call the callback when the update event is emitted', () => {
    const callback = vi.fn();
    const subscription = new Subscription('update', 'collection', null, Collection1, callback);

    const obj1 = Collection1.insert({ name: 'test' });
    Collection1.update(obj1._id, { name: 'test2' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ _id: expect.any(String), name: 'test2' }]);

    subscription.unsubscribe();
  });

  it('Should create a collection subscription and call the callback when the delete event is emitted', () => {
    const callback = vi.fn();
    const subscription = new Subscription('delete', 'collection', null, Collection1, callback);

    const obj1 = Collection1.insert({ name: 'test' });
    Collection1.delete(obj1._id);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([obj1._id]);

    subscription.unsubscribe();
  });

  it('Should stop calling the callback when the subscription is unsubscribed', () => {
    const callback = vi.fn();
    const subscription = new Subscription('create', 'collection', null, Collection1, callback);

    subscription.unsubscribe();

    Collection1.insert({ name: 'test' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('Should create a query subscription and call the callback when the create event is emitted', () => {
    const callback = vi.fn();

    const query = Collection1.query();
    const subscription = new Subscription('create', 'query', query, Collection1, callback);

    Collection1.insert({ name: 'test' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ _id: expect.any(String), name: 'test' }]);
    subscription.unsubscribe();
  });

  it('Should create a query subscription and call the callback when the update event is emitted', () => {
    const callback = vi.fn();

    const query = Collection1.query();
    const subscription = new Subscription('update', 'query', query, Collection1, callback);

    const obj1 = Collection1.insert({ name: 'test' });
    Collection1.update(obj1._id, { name: 'test2' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ _id: expect.any(String), name: 'test2' }]);

    subscription.unsubscribe();
  });

  it('Should create a query subscription and call the callback when the delete event is emitted', () => {
    const callback = vi.fn();

    const query = Collection1.query();
    const subscription = new Subscription('delete', 'query', query, Collection1, callback);

    const obj1 = Collection1.insert({ name: 'test' });
    Collection1.delete(obj1._id);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([obj1._id]);

    subscription.unsubscribe();
  });

  it('Should stop calling the callback when the query subscription is unsubscribed', () => {
    const callback = vi.fn();

    const query = Collection1.query();
    const subscription = new Subscription('create', 'query', query, Collection1, callback);

    subscription.unsubscribe();

    Collection1.insert({ name: 'test' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('Should create a query subscription and call the callback when the create event is emitted and the query matches', () => {
    const callback = vi.fn();

    const query = Collection1.query().equalTo('name', 'test');
    const subscription = new Subscription('create', 'query', query, Collection1, callback);

    Collection1.insert({ name: 'test' });
    Collection1.insert({ name: 'test2' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ _id: expect.any(String), name: 'test' }]);
    subscription.unsubscribe();
  });

  it('Should create a query subscription and call the callback when the update event is emitted and the query matches', () => {
    const callback = vi.fn((e) => {
      console.log(e)
    });

    const query = Collection1.query().equalTo('name', 'test').greaterThan('age', 21);
    const subscription = new Subscription('update', 'query', query, Collection1, callback);

    const obj1 = Collection1.insert({ name: 'test', age: 20 });
    Collection1.update(obj1._id, { name: 'test', age: 30 });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ _id: obj1._id, name: 'test', age: 30 }]);

    subscription.unsubscribe();
  });

  it('Should create a query subscription and call the callback when the delete event is emitted and the query matches', () => {
    const callback = vi.fn();

    const query = Collection1.query().equalTo('name', 'test');
    const subscription = new Subscription('delete', 'query', query, Collection1, callback);

    const obj1 = Collection1.insert({ name: 'test' });
    Collection1.delete(obj1._id);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([obj1._id]);

    subscription.unsubscribe();
  });

});
