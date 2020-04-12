import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import Canvas from './Canvas';
import LayersSidebar from './LayersSidebar';
import StylesSidebar from './StylesSidebar';
import Topbar from './Topbar';
import { store } from '../store';

const App = (): ReactElement => {
  const app = useRef<HTMLDivElement>(null);
  const globalState = useContext(store);
  const { dispatch, ready, theme } = globalState;

  useEffect(() => {
    dispatch({
      type: 'initialize-app',
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