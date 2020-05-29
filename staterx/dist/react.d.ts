/// <reference types="react" />
import { BehaviorSubject, Observable } from 'rxjs';
declare type RxInput<T> = BehaviorSubject<T> | Observable<T>;
declare type RxError = Error | undefined;
export declare function useRx<T>(obs$: RxInput<T>, initialValue: T): [T, RxError];
export declare function useRx<T, I = RxInput<T>>(obs$: I | RxInput<T>, initialValue?: T): [I extends BehaviorSubject<T> ? T : T | undefined, RxError];
export declare function useRxMemo<T>(obsFactory: () => RxInput<T>, deps: React.DependencyList | undefined, initialValue: T): [T, RxError];
export declare function useRxMemo<T = undefined>(obsFactory: () => RxInput<T>, deps: React.DependencyList | undefined, initialValue?: T): [T | undefined, RxError];
export {};
