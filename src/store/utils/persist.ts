import { getStoredState, REHYDRATE } from 'redux-persist';
import { PersistConfig, Store } from '../index';

const crossBrowserListener = (store: Store, persistConfig: PersistConfig) => {
  return async () => {
    const state = await getStoredState(persistConfig);
    store.dispatch({
      type: REHYDRATE,
      key: persistConfig.key,
      payload: state
    });
  }
}

export default crossBrowserListener;