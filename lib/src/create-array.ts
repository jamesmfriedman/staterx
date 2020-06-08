import { BehaviorSubject, Observable } from 'rxjs';
import { AnyAction, Constants, Dispatch, getType, AnyItem } from './utils';
import {
  CreateStateRxOpts,
  CreateStateRxApi,
  createStateRx
} from './create-staterx';
import { map } from 'rxjs/operators';

export interface CreateArrayOpts<T, E>
  extends CreateStateRxOpts<E, StateRxArray<T>, T[]> {
  default?: T[];
}

export interface Actions<T> {
  pop: () => { type: string };
  push: (...data: T[]) => { type: string; data: T[] };
  reverse: () => { type: string };
  shift: () => { type: string };
  unshift: (...data: T[]) => { type: string; data: T[] };
  sort: (compareFn?: (a: T, b: T) => number) => { type: string; data: T[] };
  splice: (
    start: number,
    deleteCount?: number,
    ...items: T[]
  ) => {
    type: string;
    data: { start: number; deleteCount?: number; items: T[] };
  };
}

export interface Selectors<T> {
  byIndex: (index: number) => Observable<T | undefined>;
  slice: (start?: number, end?: number) => Observable<T[]>;
}

export interface StateRxArray<T>
  extends CreateStateRxApi<T[]>,
    Actions<T>,
    Selectors<T> {}

const createSelectors = <T extends AnyItem, S extends any[]>(
  state$: Observable<S>
): Selectors<T> => {
  const byIndex = (idx: number) => state$.pipe(map((state) => state[idx]));
  const slice = (start?: number, end?: number) =>
    state$.pipe(map((state) => state.slice(start, end)));

  return {
    byIndex,
    slice
  };
};

const createActions = <T>({
  constant,
  dispatch,
  get
}: {
  constant: Constants;
  dispatch: Dispatch;
  get: () => T[];
}): Actions<T> => {
  return {
    pop: () => dispatch({ type: constant.POP }),
    push: (...data) => dispatch({ type: constant.PUSH, data }),
    shift: () => dispatch({ type: constant.SHIFT }),
    unshift: (...data) => dispatch({ type: constant.UNSHIFT, data }),
    reverse: () => dispatch({ type: constant.REVERSE }),
    sort: (compareFn) =>
      dispatch({ type: constant.SORT, data: get().slice().sort(compareFn) }),
    splice: (start, deleteCount, ...items) =>
      dispatch({
        type: constant.SPLICE,
        data: {
          start,
          deleteCount,
          items
        }
      })
  };
};

const createReducer = ({ constant }: { constant: Constants }) => (
  state: any[],
  action: AnyAction
) => {
  const type = getType(action);

  switch (type) {
    case constant.POP:
      const popClone = state.slice();
      popClone.pop();
      return popClone;
    case constant.PUSH:
      return [...state, ...action.data];
    case constant.UNSHIFT:
      return [...action.data, ...state];
    case constant.REVERSE:
      return state.slice().reverse();
    case constant.SHIFT:
      const shiftClone = state.slice();
      shiftClone.shift();
      return shiftClone;
    case constant.SORT:
      return action.data;
    case constant.SPLICE:
      const spliceClone = state.slice();
      spliceClone.splice(
        action.data.start,
        action.data.deleteCount,
        ...action.data.items
      );
      return spliceClone;
    default:
      return state;
  }
};

export const createArray = <T, E>(options: CreateArrayOpts<T, E> = {}) =>
  createStateRx(options, {
    state$: new BehaviorSubject<T[]>(options.default || []),
    constants: ['POP', 'PUSH', 'REVERSE', 'UNSHIFT', 'SHIFT', 'SORT', 'SPLICE'],
    createActions,
    createReducer,
    createSelectors
  });
