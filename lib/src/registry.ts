import { CreateStateRxApi } from './create-staterx';

const getIsomorphicStore = (): any => {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  if (typeof window !== 'undefined') {
    return window;
  }
};

const store = getIsomorphicStore();

const REGISTRY: {
  objects: { [key: string]: CreateStateRxApi<any> };
} = (store.StateRx = { objects: {} });

export const addToRegistry = (rxObj: CreateStateRxApi<any>) => {
  REGISTRY.objects[rxObj.key] = rxObj;
};
