import { createObject } from './create-object';

describe('createObject', () => {
  it('with options', () => {
    const state = createObject({
      default: { test: 'foo' },
      key: 'test',
      autoRun: true,
      effects: () => {},
      reducer: (state) => state
    });

    expect(state.key).toBe('test');
  });

  it('get', () => {
    const state = createObject({ default: { test: 'foo' } });
    expect(state.get()).toEqual({ test: 'foo' });
  });

  it('set', () => {
    const state = createObject({ default: { test: 'foo' } });
    state.set({ test: 'baz' });
    expect(state.get()).toEqual({ test: 'baz' });
  });

  it('reset', () => {
    const state = createObject({ default: { test: 'foo' } });
    state.set({ test: 'baz' });
    state.reset();
    expect(state.get()).toEqual({ test: 'foo' });
  });

  it('merge', () => {
    const state = createObject({
      default: { test: 'foo' } as { [key: string]: string }
    });
    state.merge({ hello: 'world' });
    expect(state.get()).toEqual({ test: 'foo', hello: 'world' });
  });

  it('state$', (done) => {
    const state = createObject({ default: { test: 'foo' } });

    state.state$.subscribe((val) => {
      expect(val).toEqual({ test: 'foo' });
      done();
    });
  });

  it('action$', (done) => {
    const state = createObject({ default: { test: 'foo' } });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: `${state.key}/SET`, data: { test: 'baz' } });
      done();
    });

    state.set({ test: 'baz' });
  });

  it('dispatch', (done) => {
    const state = createObject({ default: { test: 'foo' } });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: 'test' });
      done();
    });

    state.dispatch({ type: 'test' });
  });
});
