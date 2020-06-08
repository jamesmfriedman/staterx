import { CreateStateRxOpts, CreateStateRxApi } from './create-staterx';
export interface CreateValueOpts<T, E> extends CreateStateRxOpts<E, StateRxValue<T>, T> {
    default?: T;
}
export interface StateRxValue<T> extends CreateStateRxApi<T> {
}
export declare const createValue: <T, E>(options?: CreateValueOpts<T, E>) => StateRxValue<T> & import("./create-staterx").CloneApi<T, StateRxValue<T>, E> & E;
