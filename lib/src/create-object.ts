import { BehaviorSubject } from 'rxjs';
import { AnyAction, Constants, Dispatch, getType } from './utils';
import {
  CreateStateRxOpts,
  CreateStateRxApi,
  createStateRx
} from './create-staterx';

const createActions = <T>({
  constant,
  dispatch
}: {
  constant: Constants;
  dispatch: Dispatch;
}) => {
  return {
    merge: (data: Partial<T>) => dispatch({ type: constant.MERGE, data })
  };
};

const createReducer = <T>({ constant }: { constant: Constants }) => (
  state: any,
  action: AnyAction
): T => {
  const type = getType(action);

  switch (type) {
    case constant.MERGE:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
};

export interface CreateObjectOpts<T, E>
  extends CreateStateRxOpts<E, StateRxObject<T>, T> {}

export interface StateRxObject<T> extends CreateStateRxApi<T> {
  merge: (data: Partial<T>) => { type: string; data: T };
}

export const createObject = <T extends {}, E>(
  initialState: T,
  options: CreateObjectOpts<T, E> = {}
) =>
  createStateRx(initialState, options, {
    state$: new BehaviorSubject<T>(initialState),
    constants: ['MERGE'],
    createActions,
    createReducer
  });
