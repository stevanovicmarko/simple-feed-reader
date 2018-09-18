import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import counterReducer, { ICounterState } from './login/loginEntity';

interface IAppState {
  counter: ICounterState;
}

const rootReducer = combineReducers<IAppState>({ counter: counterReducer });

import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

// tslint:disable-next-line
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<IAppState> = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

export default store;
