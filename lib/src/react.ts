import { useState, useLayoutEffect, useMemo } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

type RxInput<T> =
  | BehaviorSubject<T>
  | Observable<T>
  | (() => BehaviorSubject<T> | Observable<T>);

export function useRx<T>(
  obsInput$: BehaviorSubject<T>,
  deps?: React.DependencyList | undefined
): T;

export function useRx<T>(
  obsInput$: () => BehaviorSubject<T>,
  deps?: React.DependencyList | undefined
): T;

export function useRx<T>(
  obsInput$: Observable<T>,
  deps?: React.DependencyList | undefined
): T | undefined;

export function useRx<T>(
  obsInput$: () => Observable<T>,
  deps?: React.DependencyList | undefined
): T | undefined;

export function useRx<T>(
  obsInput$: RxInput<T>,
  deps?: React.DependencyList | undefined
): T | undefined {
  const obs$ = useMemo(
    () => (typeof obsInput$ === 'function' ? obsInput$() : obsInput$),
    deps
  );

  const [value, setValue] = useState<T>(
    // @ts-ignore
    'getValue' in obs$ ? obs$.getValue() : ((undefined as unknown) as T)
  );

  // subscribe to observable
  useLayoutEffect(() => {
    const sub = obs$.subscribe(setValue, (err: any) => {
      setValue(() => {
        throw err;
      });
    });
    return () => {
      sub.unsubscribe();
    };
  }, [obs$]);

  return value;
}
