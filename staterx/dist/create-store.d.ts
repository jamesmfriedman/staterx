import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AnyAction } from './utils';
declare type GenericInputT = Observable<any> | Subject<any>;
declare type StateRxInputT = {
    name: string;
    _dispatchers$: Subject<Subject<AnyAction<any>>>;
    state$: Subject<any>;
    action$: Observable<any>;
};
declare type ObservableInputT = GenericInputT | StateRxInputT;
export declare const createStore: (observables: {
    [key: string]: ObservableInputT;
}, initialState?: {}) => {
    state$: BehaviorSubject<{}>;
    action$: Observable<any>;
    dispatch: <A extends AnyAction<any>>(action: A) => A;
    initialState: {};
    setState: (newState: {
        [key: string]: any;
    }) => void;
};
export {};
