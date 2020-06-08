import { CreateStateRxOpts, CreateStateRxApi } from './create-staterx';
export interface CreateObjectOpts<T, E> extends CreateStateRxOpts<E, StateRxObject<T>, T> {
    default?: T;
}
export interface StateRxObject<T> extends CreateStateRxApi<T> {
    merge: (data: Partial<T>) => {
        type: string;
        data: T;
    };
}
export declare const createObject: <T extends {}, E>(options?: CreateObjectOpts<T, E>) => StateRxObject<T> & import("./create-staterx").CloneApi<T, StateRxObject<T>, E> & E;
