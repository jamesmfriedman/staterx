import { useState, useLayoutEffect, useMemo } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

type RxInput<T> = BehaviorSubject<T> | Observable<T>;

export const useRx = <T>(obs$: RxInput<T>, initialValue: T): [T] => {
  const [value, _setValue] = useState<T>(
    'getValue' in obs$
      ? obs$.getValue()
      : initialValue ?? ((undefined as unknown) as T)
  );

  // subscribe to observable
  useLayoutEffect(() => {
    const sub = obs$.subscribe(_setValue);
    return () => {
      sub.unsubscribe();
    };
  }, [obs$]);

  return [value];
};

export const useRxMemo = <T>(
  obsFactory: () => RxInput<T>,
  deps: React.DependencyList | undefined,
  initialValue: T
): [T] => {
  const obs$ = useMemo(obsFactory, deps);
  return useRx(obs$, initialValue);
};
