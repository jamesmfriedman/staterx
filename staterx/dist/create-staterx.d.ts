import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AnyAction, Reducer, Constants, Dispatch } from './utils';
export interface CreateStateRxOpts<E, Api> {
    name?: string;
    autoRun?: boolean;
    effects?: (srx: Api) => E;
}
export interface CreateStateRxApi<S> {
    name: string;
    state$: BehaviorSubject<S>;
    action$: Observable<AnyAction<any>>;
    get: () => S;
    set: (data: S | ((val: S) => S)) => {
        type: string;
        data: S;
    };
    reset: () => {
        type: string;
    };
    dispatch: <A extends AnyAction>(action: A) => A;
    _dispatchers$: Subject<Subject<AnyAction<any>>>;
}
declare type CreateReducer<T, S> = (params: {
    constant: Constants;
    initialState: S;
}) => Reducer<S>;
declare type CreateActions<T, S, A> = (params: {
    constant: Constants;
    get: () => S;
    dispatch: Dispatch;
}) => A;
declare type CreateSelectors<T, S, R> = (state$: BehaviorSubject<S>) => R;
export declare const createStateRx: <T, State, Effects, ConstantsArray extends string[], Actions extends {}, Selectors extends {}, Api extends CreateStateRxApi<State>>(initialState: State, options: CreateStateRxOpts<Effects, Api> | undefined, overrides: {
    state$: BehaviorSubject<State>;
    constants: ConstantsArray;
    createReducer: CreateReducer<T, State>;
    createActions: CreateActions<T, State, Actions>;
    createSelectors?: CreateSelectors<T, State, Selectors> | undefined;
}) => Api & Effects;
export {};
