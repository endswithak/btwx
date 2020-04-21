import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);
export type StoreDispatch = typeof store.dispatch;
export type StoreGetState = typeof store.getState;

export default store;