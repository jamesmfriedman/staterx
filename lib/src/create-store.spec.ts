import { createStore } from './create-store';
import { createValue } from './create-value';
import { BehaviorSubject, Observable, of } from 'rxjs';

describe('createStore', () => {
  it('creates', () => {
    const s1 = createValue(0);
    const s2 = createValue(1);

    const store = createStore(
      {
        [s1.name]: s1,
        [s2.name]: s2
      },
      {}
    );

    expect(store.getState()).toEqual({ [s1.name]: 0, [s2.name]: 1 });
  });

  it('setState', () => {
    const s1 = createValue(0);
    const s2 = createValue(1);
    const s3 = new BehaviorSubject(2);
    const s4 = of(3);

    const store = createStore({
      [s1.name]: s1,
      [s2.name]: s2,
      s3,
      s4
    });

    store.setState({
      [s1.name]: 1,
      [s2.name]: 2,
      s3: 3,
      s4: 4
    });

    expect(store.getState()).toEqual({
      [s1.name]: 1,
      [s2.name]: 2,
      s3: 3,
      s4: 3
    });
  });
});
