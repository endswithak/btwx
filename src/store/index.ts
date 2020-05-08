import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import persist from './utils/persist';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
export const persistor = persistStore(store);
export type StoreDispatch = typeof store.dispatch;
export type StoreGetState = typeof store.getState;

window.addEventListener('storage', persist(store, persistConfig));

export default store;