import { CreateStateRxOpts, CreateStateRxApi } from './create-staterx';
export interface CreateValueOpts<T, E> extends CreateStateRxOpts<E, StateRxValue<T>> {
}
export interface StateRxValue<T> extends CreateStateRxApi<T> {
}
export declare const createValue: <T, E>(initialState: T, options?: CreateValueOpts<T, E>) => StateRxValue<T> & import("./create-staterx").CloneApi<T, StateRxValue<T>, E> & E;
