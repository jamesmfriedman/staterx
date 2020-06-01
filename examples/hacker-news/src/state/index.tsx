import { storyState } from './story';
import { userState } from './user';
import { createStore, connectReduxDevTools } from 'staterx';
export * from './story';

export const store = createStore({
  [storyState.name]: storyState,
  [userState.name]: userState
});

connectReduxDevTools(store);

store.action$.subscribe((val: any) => console.log('store', val));
