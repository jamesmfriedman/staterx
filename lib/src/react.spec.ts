import { renderHook, act } from '@testing-library/react-hooks';
import { createValue } from './create-value';
import { useRx } from './react';
import { map } from 'rxjs/operators';

describe('react', () => {
  it('useRx', () => {
    const state = createValue(0);

    // Override the default value and inject our mock _getTime function
    const { result, rerender } = renderHook(() => useRx(state.state$));

    expect(result.current).toBe(0);

    act(() => {
      state.set(1);
    });
    rerender();
    expect(result.current).toBe(1);
  });

  it('useRx error', () => {
    const state = createValue(0);

    expect(() =>
      renderHook(() =>
        useRx(() =>
          state.state$.pipe(
            map(() => {
              throw Error('Test');
            })
          )
        )
      )
    ).toThrow();
  });
});
