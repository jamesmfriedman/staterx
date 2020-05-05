/// <reference types="react" />
import { BehaviorSubject, Observable } from 'rxjs';
declare type RxInput<T> = BehaviorSubject<T> | Observable<T>;
export declare function useRx<T>(obs$: RxInput<T>, initialValue?: T): [T];
export declare function useRx<T = undefined>(obs$: RxInput<T>, initialValue?: T): [T | undefined];
export declare function useRxMemo<T>(obsFactory: () => RxInput<T>, deps: React.DependencyList | undefined, initialValue: T): [T];
export declare function useRxMemo<T = undefined>(obsFactory: () => RxInput<T>, deps: React.DependencyList | undefined, initialValue?: T): [T | undefined];
export {};
