import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const getQueryParam = (param: string) =>
  new URLSearchParams(window.location.search).get(param) || '';
