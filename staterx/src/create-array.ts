import { BehaviorSubject } from 'rxjs';
import { AnyAction, Constants, Dispatch, getType, ensureArray } from './utils';
import {
  CreateStateRxOpts,
  CreateStateRxApi,
  createStateRx
} from './create-staterx';

export interface CreateArrayOpts<T, E>
  extends CreateStateRxOpts<E, StateRxArray<T>> {}

export interface Actions<T> {
  concat: <I extends (T | ConcatArray<T>)[]>(
    ...data: I
  ) => { type: string; data: I };
  map: (
    callback: (value: T, index: number) => T
  ) => { type: string; data: T[] };
  pop: () => { type: string };
  push: (...data: T[]) => { type: string; data: T[] };
  reverse: () => { type: string };
  shift: () => { type: string };
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

export interface StateRxArray<T> extends CreateStateRxApi<T[]>, Actions<T> {}

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
    concat: (...data) => dispatch({ type: constant.CONCAT, data }),
    map: (callback) =>
      dispatch({ type: constant.MAP, data: get().map(callback) }),
    pop: () => dispatch({ type: constant.POP }),
    push: (...data) => dispatch({ type: constant.PUSH, data }),
    reverse: () => dispatch({ type: constant.REVERSE }),
    shift: () => dispatch({ type: constant.SHIFT }),
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
    case constant.CONCAT:
      return state.concat(...action.data);
    case constant.MAP:
      return action.data;
    case constant.POP:
      const popClone = state.slice();
      popClone.pop();
      return popClone;
    case constant.PUSH:
      return [...state, ...action.data];
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

export const createArray = <T, E>(
  initialState: T[],
  options: CreateArrayOpts<T, E> = {}
) =>
  createStateRx(initialState, options, {
    state$: new BehaviorSubject<T[]>(initialState),
    constants: [
      'CONCAT',
      'MAP',
      'POP',
      'PUSH',
      'REVERSE',
      'SHIFT',
      'SORT',
      'SPLICE'
    ],
    createActions,
    createReducer
  });
