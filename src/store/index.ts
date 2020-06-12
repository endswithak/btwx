import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

export const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(logger));
export const persistor = persistStore(store);
export type StoreDispatch = typeof store.dispatch;
export type StoreGetState = typeof store.getState;
export type PersistConfig = typeof persistConfig;
export type Store = typeof store;

export default store;