import { storyState } from './story';
import { userState } from './user';
import { createStore, connectDevTools } from 'staterx';
export * from './story';

export const store = createStore({
  [storyState.name]: storyState,
  [userState.name]: userState
});

connectDevTools(store);

store.action$.subscribe((val) => console.log('store', val));
