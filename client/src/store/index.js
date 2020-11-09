import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ThunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';

const initialState = {};

const middlewares = [ThunkMiddleware];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;