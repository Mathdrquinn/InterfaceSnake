import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
// import logger from 'redux-logger';

import App from './App';
import './index.css';

import reducers from './reducers';

ReactDOM.render(
    <Provider
        store={createStore(reducers, {}, applyMiddleware())}
    >
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
);
