import { Observable } from 'rxjs';
import { CreateStateRxOpts, CreateStateRxApi } from './create-staterx';
export interface CreateArrayOpts<T, E> extends CreateStateRxOpts<E, StateRxArray<T>, T[]> {
}
export interface Actions<T> {
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
    unshift: (...data: T[]) => {
        type: string;
        data: T[];
    };
    sort: (compareFn?: (a: T, b: T) => number) => {
        type: string;
        data: T[];
    };
    splice: (start: number, deleteCount?: number, ...items: T[]) => {
        type: string;
        data: {
            start: number;
            deleteCount?: number;
            items: T[];
        };
    };
}
export interface Selectors<T> {
    byIndex: (index: number) => Observable<T | undefined>;
    slice: (start?: number, end?: number) => Observable<T[]>;
}
export interface StateRxArray<T> extends CreateStateRxApi<T[]>, Actions<T>, Selectors<T> {
}
export declare const createArray: <T, E>(initialState: T[], options?: CreateArrayOpts<T, E>) => StateRxArray<T> & import("./create-staterx").CloneApi<T[], StateRxArray<T>, E> & E;
