import { BehaviorSubject, Subject, merge } from 'rxjs';
import { map, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import {
  AnyAction,
  createConstant,
  genRandomString,
  wrapDispatchSubject,
  Dispatcher,
  DispatchersList
} from './utils';

const createConstants = (name: string) => ({
  SET: createConstant(name, 'SET'),
  MERGE: createConstant(name, 'MERGE'),
  RESET: createConstant(name, 'RESET')
});

const createActions = <T>({
  constant,
  dispatch$ = new Subject<AnyAction<any>>(),
  _dispatchers$ = new Subject<Subject<AnyAction<any>>>()
}: {
  constant: ReturnType<typeof createConstants>;
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
    set: (data: T) => dispatch({ type: constant.SET, data }),
    merge: (data: Partial<T>) => dispatch({ type: constant.MERGE, data }),
    reset: () => dispatch({ type: constant.RESET }),
    dispatch,
    _dispatchers$
  };
};

const createReducer = <T>({
  state$,
  initialState,
  constant,
  isSingleValue
}: {
  state$: BehaviorSubject<T>;
  initialState: T;
  constant: ReturnType<typeof createConstants>;
  isSingleValue: boolean;
}) => (action: AnyAction): T => {
  const state = state$.getValue();
  const type = action.type.split('/', 2).join('/');

  switch (type) {
    case constant.SET:
      return action.data;
    case constant.MERGE:
      // Don't allow updates to impact single values
      if (isSingleValue) {
        return state;
      }
      return {
        ...state,
        ...action.data
      };
    case constant.RESET:
      return initialState;
    default:
      return state;
  }
};

export interface CreateObjectOpts {
  name?: string;
  isSingleValue?: boolean;
  autoRun?: boolean;
}

export const createObject = <T extends any>(
  initialState: T,
  options: CreateObjectOpts = {},
  overrides?: {
    dispatch$: Dispatcher;
    _dispatchers$: DispatchersList;
  }
) => {
  const {
    name = genRandomString(),
    isSingleValue = false,
    autoRun = true
  } = options;

  const state$ = new BehaviorSubject<T>(initialState);

  const constant = createConstants(name);

  const { action$, ...actions } = createActions<T>({
    ...overrides,
    constant
  });

  const _reducer$ = action$.pipe(
    map(
      createReducer<T>({
        state$,
        constant,
        initialState,
        isSingleValue
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
    ...actions
  };
};
