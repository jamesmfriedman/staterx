import { useState, useLayoutEffect, useMemo } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

type RxInput<T> = BehaviorSubject<T> | Observable<T>;

export function useRx<T>(obs$: RxInput<T>, initialValue?: T): [T];
export function useRx<T = undefined>(
  obs$: RxInput<T>,
  initialValue?: T
): [T | undefined];

export function useRx<T>(obs$: RxInput<T>, initialValue: T): [T | undefined] {
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

  return [value as any];
}

export function useRxMemo<T>(
  obsFactory: () => RxInput<T>,
  deps: React.DependencyList | undefined,
  initialValue: T
): [T];

export function useRxMemo<T = undefined>(
  obsFactory: () => RxInput<T>,
  deps: React.DependencyList | undefined,
  initialValue?: T
): [T | undefined];

export function useRxMemo<T>(
  obsFactory: () => RxInput<T>,
  deps: React.DependencyList | undefined,
  initialValue: T
): [T] {
  const obs$ = useMemo(obsFactory, deps);
  return useRx<T>(obs$, initialValue);
}
