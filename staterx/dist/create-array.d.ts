import { CreateStateRxOpts, CreateStateRxApi } from './create-staterx';
export interface CreateArrayOpts<T, E> extends CreateStateRxOpts<E, StateRxArray<T>> {
}
export interface Actions<T> {
    concat: <I extends (T | ConcatArray<T>)[]>(...data: I) => {
        type: string;
        data: I;
    };
    map: (callback: (value: T, index: number) => T) => {
        type: string;
        data: T[];
    };
    pop: () => {
        type: string;
    };
    push: (...data: T[]) => {
        type: string;
        data: T[];
    };
    reverse: () => {
        type: string;
    };
    shift: () => {
        type: string;
    };
}
export interface StateRxArray<T> extends CreateStateRxApi<T[]>, Actions<T> {
}
export declare const createArray: <T, E>(initialState: T[], options?: CreateArrayOpts<T, E>) => StateRxArray<T> & E;
