import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/app';
import './styles';
import * as serviceWorker from './serviceWorker';
import { Providers } from './providers';

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
