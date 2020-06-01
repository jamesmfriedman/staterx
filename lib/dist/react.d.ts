/// <reference types="react" />
import { BehaviorSubject, Observable } from 'rxjs';
export declare function useRx<T>(obsInput$: BehaviorSubject<T>, deps?: React.DependencyList | undefined): T;
export declare function useRx<T>(obsInput$: () => BehaviorSubject<T>, deps?: React.DependencyList | undefined): T;
export declare function useRx<T>(obsInput$: Observable<T>, deps?: React.DependencyList | undefined): T | undefined;
export declare function useRx<T>(obsInput$: () => Observable<T>, deps?: React.DependencyList | undefined): T | undefined;
