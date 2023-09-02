import { NeboaDocument } from "../types/neboa-document";
import { Collection } from "./collection";
import { Query } from "./query";

export class Subscription<T> {

  private _listener;

  constructor(
    private _event: 'create' | 'update' | 'delete',
    private _subscriptionType: 'query' | 'collection',
    // If the subscription is a query subscription, we need to pass the query
    private _query: Query<T> | null,
    // We always need to pass the collection
    private _collection: Collection<T>,
    // The callback is always the same
    private _callback: (documents: NeboaDocument<T>[] | string[]) => void
  ) {
    if (this._subscriptionType === 'query') {
      // Clone the query
      this._query = this._query!.clone();

      // Assign the listener
      this._listener = this.queryHandler.bind(this);

      // Subscribe to the query event
      this._collection._emitter.on(this._event, this._listener);
    } else {
      // Assign the listener
      this._listener = this.collectionHandler.bind(this);

      // Subscribe to the collection event
      this._collection._emitter.on(this._event, this._listener);
    }
  }

  private queryHandler(documents: NeboaDocument<T>[]) {
    let result: NeboaDocument<T>[] | string[] = []

    // If the event is not delete, we need to filter the documents to query only the ones affected by the event
    if (this._event !== 'delete') {
      // Modify the query to match only the documents affected by the event
      this._query!.containedIn('_id', documents.map(document => document._id));
      result = this._query!.find();
    } else {
      // If the event is delete, we can just use the documents passed to the handler
      result = documents.map(document => document._id);
    }

    // Call the callback only if there are results
    if (result.length) {
      this._callback(result);
    }
  }

  private collectionHandler(documents: NeboaDocument<T>[]) {
    if (this._event !== 'delete') {
      this._callback(documents);
    } else {
      this._callback(documents.map(document => document._id));
    }
  }

  unsubscribe() {
    this._collection._emitter.off(this._event, this._listener);
  }

}
