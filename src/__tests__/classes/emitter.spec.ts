import { describe, expect, it, vi } from "vitest";
import { Emitter } from "../../classes/emitter";

describe('Emitter class', () => {

  it('Should create an instance of Emitter with the required methods', () => {
    const emitter = new Emitter<any>();
    expect(emitter).toBeInstanceOf(Emitter);
    expect(emitter).toHaveProperty('on');
    expect(emitter).toHaveProperty('emit');
    expect(emitter).toHaveProperty('off');
  });

  it('Should register a listener and call it when the event is emitted', () => {
    const emitter = new Emitter<any>();
    const listener = vi.fn();
    emitter.on('test', listener);
    emitter.emit('test', 'data');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('data');
  });

  it('Should register multiple listeners and call them when the event is emitted', () => {
    const emitter = new Emitter<any>();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on('test', listener1);
    emitter.on('test', listener2);
    emitter.emit('test', 'data');
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener1).toHaveBeenCalledWith('data');
    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledWith('data');
  });

  it('Should not call a listener if it is not registered', () => {
    const emitter = new Emitter<any>();
    const listener = vi.fn();
    emitter.on('test', listener);
    emitter.emit('test2', 'data');
    expect(listener).not.toHaveBeenCalled();
  });

  it('Should not call a listener if it is unregistered', () => {
    const emitter = new Emitter<any>();
    const listener = vi.fn();
    emitter.on('test', listener);
    emitter.off('test', listener);
    emitter.emit('test', 'data');
    expect(listener).not.toHaveBeenCalled();
  });

  it('Should not call a listener if it is unregistered but other listeners are still registered', () => {
    const emitter = new Emitter<any>();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on('test', listener1);
    emitter.on('test', listener2);
    emitter.off('test', listener1);
    emitter.emit('test', 'data');
    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledWith('data');
  });

});
