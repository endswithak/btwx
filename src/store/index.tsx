import React, {createContext, useReducer} from 'react';
import paper from 'paper';
import reducers from './reducers';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import getTheme from './theme';

interface StateProviderProps {
  children: React.ReactNode;
}

interface AppState {
  ready: boolean;
  appWindow: Electron.BrowserWindow;
  previewWindow: Electron.BrowserWindow;
  layersSidebarWidth: number;
  stylesSidebarWidth: number;
  theme: any;
  sketchDocument: FileFormat.Document;
  sketchMeta: FileFormat.Meta;
  sketchUser: FileFormat.User;
  sketchPages: FileFormat.Page[];
  sketchImages: {
    [id: string]: Buffer;
  };
  selectedPage: FileFormat.Page;
  selectedPageArtboards: FileFormat.Artboard[];
  selectedArtboard: FileFormat.Artboard;
  selectedLayer: FileFormat.AnyLayer;
  selectedPaperLayer: paper.Item;
  selectedLayerPath: string;
  canvas: paper.View;
  dispatch(reducer: any): any;
}

const initialState: AppState = {
  ready: false,
  appWindow: null,
  previewWindow: null,
  layersSidebarWidth: 320,
  stylesSidebarWidth: 260,
  theme: getTheme('dark'),
  sketchDocument: null,
  sketchMeta: null,
  sketchUser: null,
  sketchPages: null,
  sketchImages: null,
  selectedPage: null,
  selectedPageArtboards: null,
  selectedArtboard: null,
  selectedLayer: null,
  selectedPaperLayer: null,
  selectedLayerPath: null,
  canvas: null,
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