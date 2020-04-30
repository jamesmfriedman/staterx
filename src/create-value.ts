import { createObject, CreateObjectOpts } from './create-object';

export interface CreateValueOpts extends CreateObjectOpts {}

export const createValue = <T extends any>(
  initialState?: T,
  options: CreateValueOpts = {}
) => {
  // A single state value has the exact
  // behaviors as the object, just without the ability
  // to shallowly merge. Just re-use state object
  // and don't expose anything related to merging or shallow updates
  const {
    merge,
    constant: { MERGE, ...constant },
    ...state
  } = createObject(initialState, {
    ...options,
    isSingleValue: true
  });
  return {
    ...state,
    constant
  };
};
