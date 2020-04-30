import { Subject } from 'rxjs';

export type Dispatcher = Subject<AnyAction<any>>;
export type DispatchersList = Subject<Subject<AnyAction<any>>>;

export interface AnyAction<T = any> {
  type: T;
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

export interface AnyItem {
  id: string | number;
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

export const genRandomString = () =>
  Math.random().toString(36).substring(2, 10);

export const defaultGenId = (): string => {
  return ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: any) =>
      (
        c ^
        (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
  );
};

export const ensureArray = <T>(items: any): T[] =>
  Array.isArray(items) ? items : [items];

export const createConstant = (name: string, constant: string) =>
  `${name}/${constant}`;

export const wrapDispatchSubject = (dispatch$: Subject<any>) => <
  A extends AnyAction<any>
>(
  action: A
): A => {
  dispatch$.next(action);
  return action;
};
