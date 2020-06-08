import { storyState } from './story';
import { userState } from './user';
import { createStore, connectReduxDevTools } from 'staterx';
export * from './story';

export const store = createStore({
  [storyState.key]: storyState,
  [userState.key]: userState
});

connectReduxDevTools(store);
