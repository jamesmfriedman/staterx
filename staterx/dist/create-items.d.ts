import { Observable } from 'rxjs';
import { AnyAction, AnyItem } from './utils';
import { CreateStateRxApi, CreateStateRxOpts } from './create-staterx';
declare type ItemState<Item> = {
    [key: string]: Item | undefined;
};
declare type ItemsT<T> = Partial<T> | Array<Partial<T>>;
/*******************************************************
 * Item State
 *******************************************************/
export interface CreateItemOpts<T, S, E> extends CreateStateRxOpts<E, StateRxItems<T, S>> {
    defaultItem?: Partial<T>;
    generateId?: () => string;
}
export interface StateRxItems<T, S> extends CreateStateRxApi<S> {
    create: (items: ItemsT<T> | undefined) => AnyAction<string>;
    merge: (items: ItemsT<T>) => AnyAction<string>;
    remove: (items: ItemsT<T> | string | string[]) => AnyAction<string>;
    all$: Observable<T[]>;
    mapById$: Observable<ItemState<T>>;
    byId: (id: string) => Observable<T | undefined>;
    byIds: (ids: (string | null | undefined)[]) => Observable<ItemState<T>>;
    mapByKey: (key: string) => Observable<{
        [key: string]: T[] | undefined;
    }>;
}
export declare const createItems: <T extends AnyItem, E>(initialState: ItemState<T>, options?: CreateItemOpts<T, ItemState<T>, E>) => StateRxItems<T, ItemState<T>> & E;
export {};
