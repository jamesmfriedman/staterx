import { BehaviorSubject, Subject, Observable, merge } from 'rxjs';
import { map, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import {
  AnyAction,
  AnyItem,
  genRandomString,
  ensureArray,
  defaultGenId,
  createConstant,
  wrapDispatchSubject,
  Dispatcher,
  DispatchersList,
} from './utils';

type ItemState<Item> = {
  [key: string]: Item | undefined;
};

type ItemsT<T> = Partial<T> | Array<Partial<T>>;

type PartialWithId<T> = Partial<T> & { id: string };

/*******************************************************
 * Constants
 *******************************************************/
const createConstants = (name: string) => ({
  CREATE: createConstant(name, 'CREATE'),
  REPLACE: createConstant(name, 'REPLACE'),
  UPDATE: createConstant(name, 'UPDATE'),
  REMOVE: createConstant(name, 'REMOVE'),
  RESET: createConstant(name, 'RESET'),
});

/*******************************************************
 * Actions
 *******************************************************/
const createActions = <ItemT>({
  constant,
  generateId,
  defaultItem,
  dispatch$ = new Subject<AnyAction<any>>(),
  _dispatchers$ = new Subject<Subject<AnyAction<any>>>(),
}: {
  constant: ReturnType<typeof createConstants>;
  generateId: () => string;
  defaultItem: Partial<ItemT>;
  dispatch$?: Dispatcher;
  _dispatchers$?: DispatchersList;
}) => {
  const action$ = merge<AnyAction<any>>(
    dispatch$,
    _dispatchers$.pipe(mergeMap((obs$) => obs$))
  );

  const dispatch = wrapDispatchSubject(dispatch$);

  return {
    action$,

    create: (items: ItemsT<ItemT> | undefined) => {
      const ensureItem = (items || {}) as ItemT;
      const newCreateItems = ensureArray<PartialWithId<ItemT>>(ensureItem).map(
        (item) => {
          if (item.id === undefined) {
            item.id = generateId();
          }
          return {
            ...defaultItem,
            ...item,
          };
        }
      );
      return dispatch({
        type: constant.CREATE,
        items: (newCreateItems as unknown) as ItemT[],
      });
    },

    update: (items: ItemsT<ItemT>) => {
      return dispatch({
        type: constant.UPDATE,
        items: ensureArray<ItemT>(items),
      });
    },

    remove: (items: ItemsT<ItemT> | string | string[]) => {
      const wrappedItems = !Array.isArray(items) ? [items] : items;
      return dispatch({
        type: constant.REMOVE,
        items: ensureArray<ItemT>(
          typeof wrappedItems[0] === 'string'
            ? (wrappedItems as string[]).map((id: string) => ({ id }))
            : wrappedItems
        ),
      });
    },

    replace: (items: ItemsT<ItemT>) => {
      return dispatch({
        type: constant.REPLACE,
        items: ensureArray<ItemT>(items),
      });
    },

    reset: () =>
      dispatch({
        type: constant.RESET,
      }),
    dispatch,
    _dispatchers$,
  };
};

/*******************************************************
 * Selectors
 *******************************************************/
const createSelectors = <ItemT extends AnyItem>(
  state$: Observable<ItemState<ItemT>>
) => {
  const all$ = state$.pipe(map((state) => Object.values(state) as ItemT[]));
  const mapById$ = state$.pipe(map((state) => state));

  const byId = (id: string) => state$.pipe(map((state) => state[id]));
  const byIds = (ids: Array<string | null | undefined>) =>
    state$.pipe(
      map((state) =>
        ids.reduce<ItemState<ItemT>>((acc, id) => {
          if (id) {
            acc[id] = state[id || ''];
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
          [key: string]: ItemT[] | undefined;
        }>((acc, item) => {
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
    mapById$,
    byId,
    byIds,
    mapByKey,
  };
};

/*******************************************************
 * Reducer
 *******************************************************/
const createReducer = <ItemT extends AnyItem>({
  state$,
  initialState,
  constant,
}: {
  state$: BehaviorSubject<ItemState<ItemT>>;
  initialState: ItemState<ItemT>;
  constant: ReturnType<typeof createConstants>;
}) => (action: AnyAction) => {
  const state = state$.getValue();
  const items = ensureArray<ItemT>('items' in action ? action.items : []);
  const type = action.type.split('/', 2).join('/');

  switch (type) {
    case constant.CREATE:
      const newCreateItems = (items as ItemT[]).reduce<{ [id: string]: ItemT }>(
        (acc, item) => {
          acc[item.id] = {
            ...(state[item.id] || {}),
            ...item,
          };
          return acc;
        },
        {}
      );
      return {
        ...state,
        ...newCreateItems,
      };
    case constant.UPDATE:
      const newUpdateItems = (items as ItemT[]).reduce<{ [id: string]: ItemT }>(
        (acc, item) => {
          acc[item.id] = {
            ...(state[item.id] || {}),
            ...item,
          };
          return acc;
        },
        {}
      );

      return {
        ...state,
        ...newUpdateItems,
      };
    case constant.REPLACE:
      const newReplaceItems = items.reduce<{ [id: string]: ItemT }>(
        (acc, item) => {
          acc[item.id] = item as ItemT;
          return acc;
        },
        {}
      );

      return {
        ...state,
        ...newReplaceItems,
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
    case constant.RESET:
      return initialState;
    default:
      return state;
  }
};

/*******************************************************
 * Item State
 *******************************************************/
export interface CreateStateItemsOpts<ItemT> {
  name?: string;
  defaultItem?: Partial<ItemT>;
  autoRun?: boolean;
  generateId?: () => string;
}

export const createItems = <ItemT extends AnyItem>(
  initialState: ItemState<ItemT> = {},
  options: CreateStateItemsOpts<ItemT> = {},
  overrides?: {
    dispatch$: Dispatcher;
    _dispatchers$: DispatchersList;
  }
) => {
  const {
    name = genRandomString(),
    generateId = defaultGenId,
    defaultItem = {},
    autoRun = true,
  } = options;

  const state$ = new BehaviorSubject<ItemState<ItemT>>(initialState);

  const constant = createConstants(name);

  const { action$, ...actions } = createActions<ItemT>({
    ...overrides,
    constant,
    generateId,
    defaultItem,
  });

  const selectors = createSelectors(state$);

  const _reducer$ = action$.pipe(
    map(
      createReducer<ItemT>({
        state$,
        constant,
        initialState,
      })
    ),
    distinctUntilChanged()
  );

  const run = () => _reducer$.subscribe(state$);

  autoRun && run();

  return {
    name,
    state$,
    action$,
    constant,
    run,
    _reducer$,
    ...actions,
    ...selectors,
  };
};
