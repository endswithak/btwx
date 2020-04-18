// import { createStore } from 'redux';
// import getTheme from './theme';
// import rootReducer from './reducers';

// export default createStore(rootReducer, {
//   theme: getTheme('dark'),
//   layersSidebarWidth: 320,
//   stylesSidebarWidth: 260
// });

import React, {createContext, useReducer} from 'react';
import reducers from './reducers';
import getTheme from './theme';
import PaperApp from '../canvas/app';
import Tree from '../canvas/base/tree';
import LayerNode from '../canvas/base/layerNode';

interface StateProviderProps {
  children: React.ReactNode;
}

interface AppState {
  ready: boolean;
  layersSidebarWidth: number;
  stylesSidebarWidth: number;
  theme: em.Theme;
  selection: LayerNode[];
  treeData: Tree;
  paperApp: PaperApp;
  drawing: boolean;
  drawShape: em.ShapeType;
  dispatch(reducer: any): any;
}

const initialState: AppState = {
  ready: false,
  layersSidebarWidth: 320,
  stylesSidebarWidth: 260,
  theme: getTheme('dark'),
  selection: [],
  treeData: null,
  paperApp: null,
  drawing: false,
  drawShape: null,
  dispatch: () => {
    return null;
  }
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = (props: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <Provider value={{ ...state, dispatch }}>
      {props.children}
    </Provider>
  )
};

export { store, StateProvider }