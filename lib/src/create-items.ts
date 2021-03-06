import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AnyAction,
  AnyItem,
  ensureArray,
  defaultGenId,
  Constants,
  Dispatch,
  getType
} from './utils';
import {
  CreateStateRxApi,
  CreateStateRxOpts,
  createStateRx
} from './create-staterx';

type ItemState<Item> = {
  [key: string]: Item | undefined;
};

type ItemsT<T> = Partial<T> | Array<Partial<T>>;

type PartialWithId<T> = Partial<T> & { id: string };

/*******************************************************
 * Actions
 *******************************************************/
const createActions = <T>({
  constant,
  generateId,
  defaultItem,
  dispatch
}: {
  constant: Constants;
  generateId: () => string;
  defaultItem: Partial<T> | (() => Partial<T>);
  dispatch: Dispatch;
}) => {
  return {
    create: (items?: ItemsT<T>) => {
      const ensureItem = (items || {}) as T;
      const newCreateItems = ensureArray<PartialWithId<T>>(ensureItem).map(
        (item) => {
          // istanbul ignore else
          if (item.id === undefined) {
            item.id = generateId();
          }
          return {
            ...(typeof defaultItem === 'function'
              ? defaultItem()
              : defaultItem),
            ...item
          };
        }
      );
      return dispatch({
        type: constant.CREATE,
        items: (newCreateItems as unknown) as T[]
      });
    },

    update: (items: ItemsT<T>) => {
      return dispatch({
        type: constant.UPDATE,
        items: ensureArray<T>(items)
      });
    },

    remove: (items: ItemsT<T> | string | string[]) => {
      const wrappedItems = !Array.isArray(items) ? [items] : items;
      return dispatch({
        type: constant.REMOVE,
        items: ensureArray<T>(
          typeof wrappedItems[0] === 'string'
            ? (wrappedItems as string[]).map((id: string) => ({ id }))
            : // istanbul ignore next
              wrappedItems
        )
      });
    },

    replace: (items: ItemsT<T>) => {
      return dispatch({
        type: constant.REPLACE,
        items: ensureArray<T>(items)
      });
    }
  };
};

/*******************************************************
 * Selectors
 *******************************************************/
const createSelectors = <T extends AnyItem, S>(
  state$: Observable<ItemState<T>>
) => {
  const all$ = state$.pipe(map((state) => Object.values(state) as T[]));

  const byId = (id: string) => state$.pipe(map((state) => state[id]));
  const byIds = (ids: Array<string | null | undefined>) =>
    state$.pipe(
      map((state) =>
        ids.reduce<ItemState<T>>((acc, id) => {
          // istanbul ignore else
          if (id) {
            acc[id] = state[id];
          }
          return acc;
        }, {})
      )
    );
  const mapByKey = (key: string) =>
    state$.pipe(
      map((state) => {
        const items = state;

        return Object.values(items).reduce<{
          [key: string]: T[] | undefined;
        }>((acc, item) => {
          // istanbul ignore if
          if (!item) {
            return acc;
          }

          const arr = (acc[item[key]] = acc[item[key]] || []);
          arr.push(item);
          return acc;
        }, {});
      })
    );

  return {
    all$,
    byId,
    byIds,
    mapByKey
  };
};

/*******************************************************
 * Reducer
 *******************************************************/
const createReducer = <T extends AnyItem>({
  constant,
  generateId,
  defaultItem
}: {
  constant: Constants;
  generateId: () => string;
  defaultItem: Partial<T> | (() => Partial<T>);
}) => (state: any, action: AnyAction) => {
  const items = ensureArray<T>('items' in action ? action.items : []);
  const type = getType(action);

  switch (type) {
    case constant.CREATE:
      const newCreateItems = (items as T[]).reduce<{ [id: string]: T }>(
        (acc, item) => {
          acc[item.id] = {
            ...(state[item.id] || {}),
            ...item
          };
          return acc;
        },
        {}
      );
      return {
        ...state,
        ...newCreateItems
      };
    case constant.UPDATE:
      const newUpdatedItems = (items as T[]).reduce<{ [id: string]: T }>(
        (acc, item) => {
          const existing = state[item.id] || {
            id: generateId(),
            ...(typeof defaultItem === 'function' ? defaultItem() : defaultItem)
          };

          acc[item.id] = {
            ...existing,
            ...item
          };
          return acc;
        },
        {}
      );

      return {
        ...state,
        ...newUpdatedItems
      };
    case constant.REPLACE:
      const newReplaceItems = items.reduce<{ [id: string]: T }>((acc, item) => {
        acc[item.id] = item as T;
        return acc;
      }, {});

      return {
        ...state,
        ...newReplaceItems
      };
    case constant.REMOVE:
      const newRemoveItems = items.reduce(
        (acc, item) => {
          delete acc[item.id];
          return acc;
        },
        { ...state }
      );

      return newRemoveItems;
    default:
      return state;
  }
};

/*******************************************************
 * Item State
 *******************************************************/
export interface CreateItemOpts<T, S, E>
  extends CreateStateRxOpts<E, StateRxItems<T, S>, S> {
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
  mapByKey: (
    key: keyof T
  ) => Observable<{
    [key: string]: T[] | undefined;
  }>;
}

export const createItems = <T extends AnyItem, E>(
  options: CreateItemOpts<T, ItemState<T>, E> = {}
) => {
  const { generateId = defaultGenId, defaultItem = {} } = options;

  return createStateRx(options, {
    state$: new BehaviorSubject<ItemState<T>>(options.default || {}),
    constants: ['CREATE', 'REPLACE', 'REMOVE', 'UPDATE'],
    createActions: (props) =>
      createActions({ ...props, generateId, defaultItem }),
    createReducer: (params) =>
      createReducer({
        ...params,
        generateId,
        defaultItem
      }),
    createSelectors
  });
};
