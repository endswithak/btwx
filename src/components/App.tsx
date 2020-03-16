import React, { useRef, useContext, useEffect } from 'react';
import Canvas from './Canvas';
import { store } from '../store';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface AppProps {
  sketchDocument: FileFormat.Document;
  sketchMeta: FileFormat.Meta;
  sketchUser: FileFormat.User;
  sketchPages: FileFormat.Page[];
  sketchImages: {
    [id: string]: Buffer;
  };
}

const App = (props: AppProps) => {
  const app = useRef<HTMLDivElement>(null);
  const globalState = useContext(store);
  const { dispatch, ready } = globalState;

  useEffect(() => {
    dispatch({
      type: 'initialize-app',
      ready: true,
      ...props
    });
  }, []);

  return (
    <div
      className='c-app'
      ref={app}>
        {
          ready
          ? <Canvas />
          : null
        }
    </div>
  );
}

export default App;