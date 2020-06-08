import { BehaviorSubject, Observable, Subject, merge } from 'rxjs';
import {
  AnyAction,
  genRandomString,
  createConstants,
  Reducer,
  Constants,
  wrapDispatchSubject,
  Dispatch
} from './utils';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { addToRegistry } from './registry';

const DEFAULT_CONSTANTS = ['SET', 'RESET'];

export interface CreateStateRxOpts<E, Api, State> {
  default?: State;
  key?: string;
  autoRun?: boolean;
  effects?: (srx: Api) => E;
  reducer?: (state: State, action: AnyAction) => State;
}

export interface CreateStateRxApi<S> {
  key: string;
  state$: BehaviorSubject<S>;
  action$: Observable<AnyAction<any>>;
  get: () => S;
  set: (data: S | ((val: S) => S)) => { type: string; data: S };
  reset: () => { type: string };
  dispatch: <A extends AnyAction>(action: A) => A;
  _dispatchers$: Subject<Subject<AnyAction<any>>>;
  toJSON: () => string;
}

export interface CloneApi<State, Api, Effects> {
  clone: (options?: CreateStateRxOpts<Effects, Api, State>) => Api & Effects;
}

type CreateReducer<T, S> = (params: { constant: Constants }) => Reducer<S>;

type CreateActions<T, S, A> = (params: {
  constant: Constants;
  get: () => S;
  dispatch: Dispatch;
}) => A;

type CreateSelectors<T, S, R> = (state$: BehaviorSubject<S>) => R;

const createBaseActions = <T>({
  constant,
  get
}: {
  constant: Constants;
  get: () => T;
}) => {
  const dispatch$ = new Subject<AnyAction<any>>();
  const _dispatchers$ = new Subject<Subject<AnyAction<any>>>();

  const action$ = merge<AnyAction<any>>(
    dispatch$,
    _dispatchers$.pipe(mergeMap((obs$) => obs$))
  );

  const dispatch = wrapDispatchSubject(dispatch$);

  return {
    action$,
    set: (data: T | ((val: T) => T)) => {
      // @ts-ignore
      data = typeof data === 'function' ? data(get()) : data;
      return dispatch({ type: constant.SET, data });
    },
    reset: () => dispatch({ type: constant.RESET }),
    dispatch,
    _dispatchers$
  };
};

const createBaseReducer = <S>({
  initialState,
  constant,
  reducer,
  userReducer
}: {
  initialState: S;
  constant: Constants;
  reducer: Reducer;
  userReducer: Reducer;
}) => (state: any, action: AnyAction): S => {
  const type = action.type.split('/', 2).join('/');

  switch (type) {
    case constant.SET:
      return action.data;
    case constant.RESET:
      return initialState;
    default:
      const res = reducer(state, action);
      // if the result is the same as our initial state
      // pass it on to the user reducer
      return res === state ? userReducer(state, action) : res;
  }
};

export const createStateRx = <
  T,
  State,
  Effects,
  ConstantsArray extends string[],
  Actions extends {},
  Selectors extends {},
  Api extends CreateStateRxApi<State>
>(
  options: CreateStateRxOpts<Effects, Api, State>,
  overrides: {
    state$: BehaviorSubject<State>;
    constants: ConstantsArray;
    createReducer: CreateReducer<T, State>;
    createActions: CreateActions<T, State, Actions>;
    createSelectors?: CreateSelectors<T, State, Selectors>;
  }
) => {
  const {
    default: initialState,
    key = genRandomString(),
    autoRun = true,
    reducer: userReducer = (state) => state
  } = options;

  const {
    state$,
    constants,
    createReducer,
    createActions,
    createSelectors
  } = overrides;

  const constant = createConstants(key, [...DEFAULT_CONSTANTS, ...constants]);

  const get = () => state$.getValue();

  const { action$, dispatch, ...baseActions } = createBaseActions({
    constant,
    get
  });

  const { ...actions } = createActions({
    constant,
    get,
    dispatch
  });

  const selectors = createSelectors?.(state$);

  const reducer = createBaseReducer({
    constant,
    initialState: initialState as State,
    reducer: createReducer({
      constant
    }),
    userReducer
  });

  const clone = (newOptions?: CreateStateRxOpts<Effects, Api, State>) => {
    const newInitialState =
      newOptions?.default !== undefined ? newOptions.default : get();

    return createStateRx(
      {
        ...options,
        key: genRandomString(),
        default: newInitialState,
        ...newOptions
      },
      {
        ...overrides,
        state$: new BehaviorSubject<State>(newInitialState)
      }
    );
  };

  const _reducer$ = action$.pipe(
    map((action) => reducer(state$.getValue(), action)),
    distinctUntilChanged()
  );

  const toJSON = () => get();

  const run = () => _reducer$.subscribe(state$);

  const api = ({
    ...actions,
    ...selectors,
    ...baseActions,
    key,
    state$,
    action$,
    constant,
    run,
    get,
    clone,
    dispatch,
    toJSON,
    _reducer$
  } as unknown) as Api & CloneApi<State, Api, Effects>;

  const effects = options.effects?.(api) as Effects;

  autoRun && run();

  const inst = { ...api, ...effects };

  addToRegistry(inst);

  return inst;
};
