import { Subject } from 'rxjs';
export declare type Dispatcher = Subject<AnyAction<any>>;
export declare type DispatchersList = Subject<Subject<AnyAction<any>>>;
export interface AnyAction<T = any> {
    type: T;
    [extraProps: string]: any;
}
export declare type Reducer<R = any> = (state: any, action: AnyAction<string>) => R;
export declare type Constants = {
    [key: string]: string;
};
export declare type Dispatch = <A extends AnyAction<any>>(action: A) => A;
export interface AnyItem {
    id: string | number;
    [extraProps: string]: any;
}
export declare const genRandomString: () => string;
export declare const defaultGenId: () => string;
export declare const ensureArray: <T>(items: any) => T[];
export declare const createConstant: (name: string, constant: string) => string;
export declare const createConstants: <C extends string>(name: string, constants: C[]) => { [key in C]: string; };
export declare const wrapDispatchSubject: (dispatch$: Subject<any>) => <A extends AnyAction<any>>(action: A) => A;
export declare const getType: (action: AnyAction<any>) => any;
