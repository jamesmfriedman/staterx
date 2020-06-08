import { BehaviorSubject } from 'rxjs';
import {
  CreateStateRxOpts,
  CreateStateRxApi,
  createStateRx
} from './create-staterx';

export interface CreateValueOpts<T, E>
  extends CreateStateRxOpts<E, StateRxValue<T>, T> {
  default?: T;
}

export interface StateRxValue<T> extends CreateStateRxApi<T> {}

export const createValue = <T, E>(options: CreateValueOpts<T, E> = {}) =>
  createStateRx(options, {
    state$: new BehaviorSubject<T>(options.default as T),
    constants: [],
    createActions: () => ({}),
    createReducer: () => (state: T) => state
  });
