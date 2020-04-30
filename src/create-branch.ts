import { createItems } from './create-items';
import { createObject } from './create-object';
import {
  AnyItem,
  AnyAction,
  genRandomString,
  wrapDispatchSubject,
} from './utils';
import { Subject, merge, BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, scan } from 'rxjs/operators';

type BranchState<Item> = {
  items: { [key: string]: Item | undefined };
};

export interface CreateBranchOpts<ItemT> {
  name?: string;
  autoRun?: boolean;
  defaultItem?: Partial<ItemT>;
  generateId?: () => string;
}

export const createBranch = <
  ItemT extends AnyItem,
  ItemStateT extends BranchState<ItemT>
>(
  initialState: ItemStateT = { items: {} } as ItemStateT,
  options: CreateBranchOpts<ItemT> = {}
) => {
  const { name = genRandomString(), autoRun = true } = options;
  //const state$ = new BehaviorSubject<ItemStateT>(initialState);
  const dispatch$ = new Subject<AnyAction<any>>();
  const _dispatchers$ = new Subject<Subject<AnyAction<any>>>();

  const mergedOpts = {
    ...options,
    autoRun: true,
    name,
  };

  const overrides = {
    dispatch$,
    _dispatchers$,
  };

  // Create individual states
  const itemState = createItems<ItemT>(
    initialState.items,
    mergedOpts,
    overrides
  );

  const objectState = createObject<ItemStateT>(
    initialState,
    mergedOpts,
    overrides
  );

  // Merge all actions
  const action$ = merge(itemState.action$, objectState.action$);

  const state$ = new BehaviorSubject(initialState);
  const setState = state$.next.bind(state$);

  // Calling next actually should lift our
  // call to the child handlers
  state$.next = (newState: ItemStateT) => {
    objectState.state$.next(newState);
    itemState.state$.next(newState.items);
  };

  // Merge all reducers
  const reducer$ = combineLatest(
    objectState._reducer$,
    itemState._reducer$
  ).pipe(
    scan((acc, [obj, items]) => {
      return {
        ...acc,
        ...obj,
        items,
      };
    }, initialState),
    distinctUntilChanged()
  );

  const run = () => reducer$.subscribe((newState) => setState(newState));

  autoRun && run();

  return {
    ...objectState,
    ...itemState,
    constant: {
      ...itemState.constant,
      ...objectState.constant,
    },
    state$,
    action$,
    dispatch: wrapDispatchSubject(dispatch$),
    _dispatchers$,
    run,
  };
};
