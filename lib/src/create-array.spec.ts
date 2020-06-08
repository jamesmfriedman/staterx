import { createArray } from './create-array';

describe('createObject', () => {
  it('with options', () => {
    const state = createArray({
      key: 'test',
      autoRun: true,
      effects: () => {},
      reducer: (state) => state
    });

    expect(state.key).toBe('test');
  });

  it('get', () => {
    const state = createArray({ default: [0] });
    expect(state.get()).toEqual([0]);
  });

  it('set', () => {
    const state = createArray({ default: [0] });
    state.set([1]);
    expect(state.get()).toEqual([1]);
  });

  it('reset', () => {
    const state = createArray({ default: [0] });
    state.set([1]);
    state.reset();
    expect(state.get()).toEqual([0]);
  });

  it('state$', (done) => {
    const state = createArray({ default: [0] });

    state.state$.subscribe((val) => {
      expect(val).toEqual([0]);
      done();
    });
  });

  it('action$', (done) => {
    const state = createArray({ default: [0] });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: `${state.key}/SET`, data: [1] });
      done();
    });

    state.set([1]);
  });

  it('dispatch', (done) => {
    const state = createArray({ default: [0] });

    state.action$.subscribe((val) => {
      expect(val).toEqual({ type: 'test' });
      done();
    });

    state.dispatch({ type: 'test' });
  });

  it('pop', () => {
    const state = createArray({ default: [0] });
    state.pop();
    expect(state.get()).toEqual([]);
  });

  it('push', () => {
    const state = createArray({ default: [0] });
    state.push(1, 2, 3);
    expect(state.get()).toEqual([0, 1, 2, 3]);
  });

  it('shift', () => {
    const state = createArray({ default: [0, 1] });
    state.shift();
    expect(state.get()).toEqual([1]);
  });

  it('unshift', () => {
    const state = createArray({ default: [2, 3] });
    state.unshift(0, 1);
    expect(state.get()).toEqual([0, 1, 2, 3]);
  });

  it('reverse', () => {
    const state = createArray({ default: [1, 2, 3] });
    state.reverse();
    expect(state.get()).toEqual([3, 2, 1]);
  });

  it('sort', () => {
    const state = createArray({ default: [3, 1, 2, 4] });
    state.sort((a, b) => a - b);
    expect(state.get()).toEqual([1, 2, 3, 4]);
  });

  it('splice', () => {
    const state = createArray({ default: [1, 2, 3] });
    state.splice(0, 1);
    expect(state.get()).toEqual([2, 3]);
  });

  it('byIndex', (done) => {
    const state = createArray({ default: [1, 2, 3] });
    state.byIndex(1).subscribe((val) => {
      expect(val).toBe(2);
      done();
    });
  });

  it('slice', (done) => {
    const state = createArray({ default: [1, 2, 3] });
    state.slice(1).subscribe((val) => {
      expect(val).toEqual([2, 3]);
      done();
    });
  });
});
