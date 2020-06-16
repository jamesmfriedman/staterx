import React from 'react';
import ReactDOM from 'react-dom';
import './styles';
import App from './views/app';
import * as serviceWorker from './serviceWorker';
import { bridge } from '@common/bridge';

if (process.env.NODE_ENV === 'production') {
  bridge.init();
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
