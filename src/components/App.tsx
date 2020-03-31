import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import Canvas from './Canvas';
import LayersSidebar from './LayersSidebar';
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
  const { dispatch, ready, selectedLayerPath } = globalState;

  useEffect(() => {
    const selectedPage = props.sketchPages.find((sketchPage) => sketchPage.name === 'sketch-animate');
    const selectedPageArtboards = selectedPage.layers.filter((layer) => layer._class === 'artboard');
    dispatch({
      type: 'initialize-app',
      ...props,
      ready: true,
      selectedPage: selectedPage,
      selectedPageArtboards: selectedPageArtboards,
      selectedArtboard: selectedPageArtboards[0]
    });
  }, []);

  return (
    <div
      className='c-app'
      ref={app}>
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
    </div>
  );
}

export default App;