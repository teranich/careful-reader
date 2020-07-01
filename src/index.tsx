import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import thunk from 'redux-thunk'
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ShelfReducer } from './store/reducers';

const state = {
  shelf: ShelfReducer,
  app: (state = []) => state
}
const rootReducer = combineReducers(state)

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(
    thunk
  )))



const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))

