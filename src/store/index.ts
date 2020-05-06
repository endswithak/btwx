import { createStore, applyMiddleware } from 'redux';
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk, logger, createStateSyncMiddleware({})));
export type StoreDispatch = typeof store.dispatch;
export type StoreGetState = typeof store.getState;

initStateWithPrevTab(store);

export default store;