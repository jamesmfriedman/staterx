import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

export const getQueryParam = (param: string) =>
  new URLSearchParams(window.location.search).get(param) || '';
