import { AnyAction } from './utils';
export declare const connectDevTools: (store: {
    state$: import("rxjs").BehaviorSubject<{}>;
    action$: import("rxjs").Observable<any>;
    dispatch: <A extends AnyAction<any>>(action: A) => A;
    initialState: {};
    setState: (newState: {
        [key: string]: any;
    }) => void;
    getState: () => {};
}) => void;
