import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import Canvas from './Canvas';
import LayersSidebar from './LayersSidebar';
import StylesSidebar from './StylesSidebar';
import Topbar from './Topbar';
import { store } from '../store';

interface AppProps {
  sketchDocument: FileFormat.Document;
  sketchMeta: FileFormat.Meta;
  sketchUser: FileFormat.User;
  sketchPages: FileFormat.Page[];
  sketchImages: {
    [id: string]: Buffer;
  };
}

const App = (props: AppProps): ReactElement => {
  const app = useRef<HTMLDivElement>(null);
  const globalState = useContext(store);
  const { dispatch, ready, selectedLayerPath, theme, canvas } = globalState;

  useEffect(() => {
    dispatch({
      type: 'initialize-app',
      ...props,
      ready: true
    });
  }, []);

  return (
    <div
      className='c-app'
      ref={app}
      style={{
        background: theme.background.z0
      }}>
        {
          ready
          ? <Topbar />
          : null
        }
        <div className='c-app__canvas'>
          {
            ready
            ? <LayersSidebar />
            : null
          }
          {
            ready
            ? <Canvas />
            : null
          }
          {
            ready
            ? <StylesSidebar />
            : null
          }
        </div>
    </div>
  );
}

export default App;