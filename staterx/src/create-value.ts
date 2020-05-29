import { BehaviorSubject } from 'rxjs';
import {
  CreateStateRxOpts,
  CreateStateRxApi,
  createStateRx
} from './create-staterx';

export interface CreateValueOpts<T, E>
  extends CreateStateRxOpts<E, StateRxValue<T>, T> {}

export interface StateRxValue<T> extends CreateStateRxApi<T> {}

export const createValue = <T, E>(
  initialState: T,
  options: CreateValueOpts<T, E> = {}
) =>
  createStateRx(initialState, options, {
    state$: new BehaviorSubject<T>(initialState),
    constants: [],
    createActions: () => ({}),
    createReducer: () => (state: T) => state
  });
