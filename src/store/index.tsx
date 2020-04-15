import React, {createContext, useReducer} from 'react';
import paper from 'paper';
import reducers from './reducers';
import getTheme from './theme';
import PaperApp from '../canvas/app';
import PaperGroup from '../canvas/base/group';
import PaperShape from '../canvas/base/shape';
import TreeNode from '../canvas/base/treeNode';
import Tree from '../canvas/base/tree';

interface StateProviderProps {
  children: React.ReactNode;
}

interface AppState {
  ready: boolean;
  layersSidebarWidth: number;
  stylesSidebarWidth: number;
  theme: em.Theme;
  selection: TreeNode[];
  treeData: Tree;
  paperApp: PaperApp;
  drawing: boolean;
  drawShape: em.ShapeType;
  dragLayer: TreeNode;
  dragEnterLayer: TreeNode;
  dropzone: 'top' | 'center' | 'bottom';
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
  dragLayer: null,
  dragEnterLayer: null,
  dropzone: null,
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