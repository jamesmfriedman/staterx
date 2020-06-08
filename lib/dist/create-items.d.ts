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
export interface CreateItemOpts<T, S, E> extends CreateStateRxOpts<E, StateRxItems<T, S>, S> {
    default?: S;
    /** A default item to shallowly merge into newly created items. */
    defaultItem?: Partial<T> | (() => Partial<T>);
    /** A custom method for generating IDs for new items. */
    generateId?: () => string;
}
export interface StateRxItems<T, S> extends CreateStateRxApi<S> {
    create: (items?: ItemsT<T>) => AnyAction<string>;
    update: (items: ItemsT<T>) => AnyAction<string>;
    replace: (items: ItemsT<T>) => AnyAction<string>;
    remove: (items: ItemsT<T> | string | string[]) => AnyAction<string>;
    all$: Observable<T[]>;
    byId: (id: string) => Observable<T | undefined>;
    byIds: (ids: (string | null | undefined)[]) => Observable<ItemState<T>>;
    mapByKey: (key: keyof T) => Observable<{
        [key: string]: T[] | undefined;
    }>;
}
export declare const createItems: <T extends AnyItem, E>(options?: CreateItemOpts<T, ItemState<T>, E>) => StateRxItems<T, ItemState<T>> & import("./create-staterx").CloneApi<ItemState<T>, StateRxItems<T, ItemState<T>>, E> & E;
export {};
