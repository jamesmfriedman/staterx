import { useState, useLayoutEffect, useMemo } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

type RxInput<T> = BehaviorSubject<T> | Observable<T>;

type RxError = Error | undefined;

export function useRx<T>(obs$: RxInput<T>, initialValue: T): [T, RxError];
export function useRx<T, I = RxInput<T>>(
  obs$: I | RxInput<T>,
  initialValue?: T
): [I extends BehaviorSubject<T> ? T : T | undefined, RxError];

export function useRx<T>(
  obs$: RxInput<T>,
  initialValue: T
): [T | undefined, RxError] {
  const [value, setValue] = useState<T>(
    'getValue' in obs$
      ? obs$.getValue()
      : initialValue ?? ((undefined as unknown) as T)
  );
  const [error, setError] = useState<Error>();

  // subscribe to observable
  useLayoutEffect(() => {
    const sub = obs$.subscribe(setValue, setError);
    return () => {
      sub.unsubscribe();
    };
  }, [obs$]);

  return [value as T, error];
}

export function useRxMemo<T>(
  obsFactory: () => RxInput<T>,
  deps: React.DependencyList | undefined,
  initialValue: T
): [T, RxError];

export function useRxMemo<T = undefined>(
  obsFactory: () => RxInput<T>,
  deps: React.DependencyList | undefined,
  initialValue?: T
): [T | undefined, RxError];

export function useRxMemo<T>(
  obsFactory: () => RxInput<T>,
  deps: React.DependencyList | undefined,
  initialValue: T
): [T, RxError] {
  const obs$ = useMemo(obsFactory, deps);
  return useRx<T>(obs$, initialValue);
}
