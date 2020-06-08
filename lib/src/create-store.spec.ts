import { createStore } from './create-store';
import { createValue } from './create-value';
import { BehaviorSubject, Observable, of } from 'rxjs';

describe('createStore', () => {
  it('creates', () => {
    const s1 = createValue({ default: 0 });
    const s2 = createValue({ default: 1 });

    const store = createStore(
      {
        [s1.key]: s1,
        [s2.key]: s2
      },
      {}
    );

    expect(store.getState()).toEqual({ [s1.key]: 0, [s2.key]: 1 });
  });

  it('setState', () => {
    const s1 = createValue({ default: 0 });
    const s2 = createValue({ default: 1 });
    const s3 = new BehaviorSubject(2);
    const s4 = of(3);

    const store = createStore({
      [s1.key]: s1,
      [s2.key]: s2,
      s3,
      s4
    });

    store.setState({
      [s1.key]: 1,
      [s2.key]: 2,
      s3: 3,
      s4: 4
    });

    expect(store.getState()).toEqual({
      [s1.key]: 1,
      [s2.key]: 2,
      s3: 3,
      s4: 3
    });
  });
});
