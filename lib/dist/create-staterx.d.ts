import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AnyAction, Reducer, Constants, Dispatch } from './utils';
export interface CreateStateRxOpts<E, Api, State> {
    name?: string;
    autoRun?: boolean;
    effects?: (srx: Api) => E;
    reducer?: (state: State, action: AnyAction) => State;
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
export interface CloneApi<State, Api, Effects> {
    clone: (initialState?: State) => Api & Effects;
}
declare type CreateReducer<T, S> = (params: {
    constant: Constants;
}) => Reducer<S>;
declare type CreateActions<T, S, A> = (params: {
    constant: Constants;
    get: () => S;
    dispatch: Dispatch;
}) => A;
declare type CreateSelectors<T, S, R> = (state$: BehaviorSubject<S>) => R;
export declare const createStateRx: <T, State, Effects, ConstantsArray extends string[], Actions extends {}, Selectors extends {}, Api extends CreateStateRxApi<State>>(initialState: State, options: CreateStateRxOpts<Effects, Api, State>, overrides: {
    state$: BehaviorSubject<State>;
    constants: ConstantsArray;
    createReducer: CreateReducer<T, State>;
    createActions: CreateActions<T, State, Actions>;
    createSelectors?: CreateSelectors<T, State, Selectors> | undefined;
}) => Api & CloneApi<State, Api, Effects> & Effects;
export {};
