import React, {createContext, useReducer} from 'react';
import reducers from './reducers';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface StateProviderProps {
  children: React.ReactNode;
}

interface AppState {
  ready: boolean;
  sketchDocument: FileFormat.Document;
  sketchMeta: FileFormat.Meta;
  sketchUser: FileFormat.User;
  sketchPages: FileFormat.Page[];
  sketchImages: {
    [id: string]: Buffer;
  };
  dispatch(reducer: any): any;
}

const initialState: AppState = {
  ready: false,
  sketchDocument: null,
  sketchMeta: null,
  sketchUser: null,
  sketchPages: null,
  sketchImages: null,
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