import { createValue } from './create-value';
import { Subject } from 'rxjs';

describe('createValue', () => {
  it('with options', () => {
    const state = createValue({
      key: 'test',
      default: 0,
      autoRun: true,
      effects: () => {},
      reducer: (state) => state
    });

    expect(state.key).toBe('test');
  });

  it('clone', () => {
    const state = createValue({ default: 0 });
    expect(state.clone().get()).toBe(0);
    expect(state.clone({ default: 1 }).get()).toBe(1);
  });

  it('_dispatchers$', () => {
    const state = createValue({ default: 0 });
    state._dispatchers$.next(new Subject());
  });

  it('get', () => {
    const state = createValue({ default: 0 });
    expect(state.get()).toBe(0);
  });

  it('set', () => {
    const state = createValue({ default: 0 });

    // direct set
    state.set(1);
    expect(state.get()).toBe(1);

    // as function
    state.set((val) => {
      expect(val).toBe(1);
      return 2;
    });
    expect(state.get()).toBe(2);
  });

  it('reset', () => {
    const state = createValue({ default: 0 });
    state.set(1);
    state.reset();
    expect(state.get()).toBe(0);
  });

  it('state$', (done) => {
    const state = createValue({ default: 0 });

    state.state$.subscribe((val) => {
      expect(val).toBe(0);
      done();
    });
  });

  it('action$', (done) => {
    const state = createValue({ default: 0 });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: `${state.key}/SET`, data: 1 });
      done();
    });

    state.set(1);
  });

  it('dispatch', (done) => {
    const state = createValue({ default: 0 });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: 'test' });
      done();
    });

    state.dispatch({ type: 'test' });
  });

  it('custom reducer', (done) => {
    const state = createValue({
      default: 0,
      reducer: (state, action) => {
        switch (action.type) {
          case 'hello':
            return 100;
          default:
            return state;
        }
      }
    });

    state.dispatch({ type: 'hello' });
    state.state$.subscribe((val) => {
      expect(val).toBe(100);
      done();
    });
  });
});
