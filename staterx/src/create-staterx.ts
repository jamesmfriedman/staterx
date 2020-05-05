import { BehaviorSubject, Observable, Subject, merge } from 'rxjs';
import {
  AnyAction,
  genRandomString,
  createConstants,
  Reducer,
  Constants,
  Dispatcher,
  DispatchersList,
  wrapDispatchSubject,
  Dispatch
} from './utils';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';

const DEFAULT_CONSTANTS = ['SET', 'RESET'];

export interface CreateStateRxOpts<E, Api> {
  name?: string;
  autoRun?: boolean;
  effects?: (srx: Api) => E;
}

export interface CreateStateRxApi<S> {
  name: string;
  state$: BehaviorSubject<S>;
  action$: Observable<AnyAction<any>>;
  get: () => S;
  set: (data: S | ((val: S) => S)) => { type: string; data: S };
  reset: () => { type: string };
  dispatch: <A extends AnyAction>(action: A) => A;
  _dispatchers$: Subject<Subject<AnyAction<any>>>;
}

type CreateReducer<T, S> = (params: {
  constant: Constants;
  initialState: S;
}) => Reducer<S>;

type CreateActions<T, S, A> = (params: {
  constant: Constants;
  get: () => S;
  dispatch: Dispatch;
}) => A;

type CreateSelectors<T, S, R> = (state$: BehaviorSubject<S>) => R;

const createBaseActions = <T>({
  constant,
  get,
  dispatch$ = new Subject<AnyAction<any>>(),
  _dispatchers$ = new Subject<Subject<AnyAction<any>>>()
}: {
  constant: Constants;
  get: () => T;
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
  reducer
}: {
  initialState: S;
  constant: Constants;
  reducer: Reducer;
}) => (state: any, action: AnyAction): S => {
  const type = action.type.split('/', 2).join('/');

  switch (type) {
    case constant.SET:
      return action.data;
    case constant.RESET:
      return initialState;
    default:
      return reducer(state, action);
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
  initialState: State,
  options: CreateStateRxOpts<Effects, Api> = {},
  overrides: {
    state$: BehaviorSubject<State>;
    constants: ConstantsArray;
    createReducer: CreateReducer<T, State>;
    createActions: CreateActions<T, State, Actions>;
    createSelectors?: CreateSelectors<T, State, Selectors>;
  }
) => {
  const { name = genRandomString(), autoRun = true } = options;

  const {
    state$,
    constants,
    createReducer,
    createActions,
    createSelectors
  } = overrides;

  const constant = createConstants(name, [...DEFAULT_CONSTANTS, ...constants]);

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
    initialState,
    reducer: createReducer({
      constant,
      initialState
    })
  });

  const _reducer$ = action$.pipe(
    map((action) => reducer(state$.getValue(), action)),
    distinctUntilChanged()
  );

  const run = () => _reducer$.subscribe(state$);

  const api = ({
    ...actions,
    ...selectors,
    ...baseActions,
    name,
    state$,
    action$,
    constant,
    run,
    get,
    dispatch,
    _reducer$
  } as unknown) as Api;

  const effects = options.effects?.((api as unknown) as Api) as Effects;

  autoRun && run();

  return { ...api, ...effects };
};
