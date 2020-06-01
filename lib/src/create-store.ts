import { Observable, merge, Subject, BehaviorSubject } from 'rxjs';
import { map, scan, distinctUntilChanged } from 'rxjs/operators';
import { AnyAction, wrapDispatchSubject } from './utils';

type GenericInputT = Observable<any> | Subject<any>;
type StateRxInputT = {
  name: string;
  _dispatchers$: Subject<Subject<AnyAction<any>>>;
  state$: Subject<any>;
  action$: Observable<any>;
};
type ObservableInputT = GenericInputT | StateRxInputT;

export const createStore = (
  observables: { [key: string]: ObservableInputT },
  initialState = {}
) => {
  const stateRxBranches = Object.values(observables).filter(
    (branch) => 'state$' in branch
  ) as StateRxInputT[];

  // Create dispatch function and add to all of our branches
  const dispatch$ = new Subject<AnyAction<any>>();
  stateRxBranches.forEach((branch) => {
    branch._dispatchers$.next(dispatch$);
  });

  // Create Normalized State {[stateKey]: observable}
  const normalizedObservables = Object.entries(observables).map(
    ([key, input]) => {
      const obs = 'state$' in input ? input.state$ : input;
      return obs.pipe(
        distinctUntilChanged(),
        map((val) => ({ [key]: val }))
      );
    }
  );

  const state$ = new BehaviorSubject(initialState);

  const reducer$ = merge(...normalizedObservables).pipe(
    scan((acc, val) => {
      return {
        ...acc,
        ...val
      };
    }, initialState)
  );

  const action$ = merge(
    dispatch$,
    ...stateRxBranches.map((state) => state.action$)
  ).pipe(distinctUntilChanged());

  reducer$.subscribe(state$);

  const setState = (newState: { [key: string]: any }) => {
    for (const key in newState) {
      const obs = observables[key];
      const newValue = newState[key];

      if ('state$' in obs) {
        obs.state$.next(newValue);
      } else if ('next' in obs) {
        obs.next(newValue);
      } else {
        console.warn(
          `Cannot set store value of ${key}. It is not a StateRx Objects or subject.`
        );
      }
    }
  };

  const getState = () => state$.getValue();

  return {
    state$,
    action$,
    dispatch: wrapDispatchSubject(dispatch$),
    initialState,
    setState,
    getState
  };
};
