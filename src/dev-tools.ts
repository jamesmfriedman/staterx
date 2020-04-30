import { createStore } from './create-store';
import { AnyAction } from './utils';
import { distinctUntilChanged } from 'rxjs/operators';

interface DevToolsExtension {
  connect: (options: any) => DevTools;
  disconnect: Function;
  send: Function;
  listen: Function;
  open: Function;
  notifyErrors: Function;
}

interface DevTools {
  /** adds a change listener. It will be called any time an action is dispatched from the monitor. Returns a function to unsubscribe the current listener*/
  subscribe: (listener: any) => () => void;
  /** unsubscribes all listeners. */
  unsubscribe: () => void;
  /** sends a new action and state manually to be shown on the monitor. If action is null then we suppose we send liftedState. */
  send: (action: AnyAction<any>, state: any) => void;
  /** sends the initial state to the monitor. */
  init: (state: any) => void;
  /** sends the error message to be shown in the extension's monitor. */
  error: (message: any) => void;
}

const extension: DevToolsExtension = (window as any)
  .__REDUX_DEVTOOLS_EXTENSION__;

export const connectDevTools = (store: ReturnType<typeof createStore>) => {
  if (!extension) {
    console.error('No Redux Dev Tools extension detected');
  }

  const dev = extension.connect({ name: 'StateRx' });

  // init the store
  dev.init(store.initialState);

  // send new actions
  store.action$.pipe(distinctUntilChanged()).subscribe({
    next: (action) => dev.send(action, store.state$.value),
    error: (err) => dev.error(err)
  });

  // listen to dispatches
  dev.subscribe(
    (data: { payload?: any; type: string; source: string; state: string }) => {
      switch (data.type) {
        case 'DISPATCH':
          if (data.payload.type === 'JUMP_TO_ACTION') {
            store.setState(JSON.parse(data.state));
          }
          break;
        case 'ACTION':
          const action = data.payload && JSON.parse(data.payload);
          action && store.dispatch(action);
          break;
      }
    }
  );
};
