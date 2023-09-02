
export class Emitter<T> {

  private _listeners: Map<string, ((data: T) => void)[]> = new Map();

  on(event: string, listener: (data: T) => void) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event)!.push(listener);
  }

  emit(event: string, data: T) {
    if (this._listeners.has(event)) {
      this._listeners.get(event)!.forEach(listener => listener(data));
    }
  }

  off(event: string, listener: (data: T) => void) {
    if (this._listeners.has(event)) {
      const listeners = this._listeners.get(event)!;
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

}
