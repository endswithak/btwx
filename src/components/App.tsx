import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import Canvas from './Canvas';
import LayersSidebar from './LayersSidebar';
import StylesSidebar from './StylesSidebar';
import Topbar from './Topbar';
import AnimationDrawer from './AnimationDrawer';
import AnimationSelectMenu from './AnimationSelectMenu';
import ArtboardSelectMenu from './ArtboardSelectMenu';
import { ThemeContext } from './ThemeProvider';

const App = (): ReactElement => {
  const app = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);

  return (
    <div
      id='app'
      className='c-app'
      ref={app}
      style={{
        background: theme.background.z0
      }}>
        <Topbar />
        <div className='c-app__canvas'>
          <LayersSidebar />
          <div className='c-app__main'>
            <Canvas />
            <AnimationDrawer />
          </div>
        </div>
        <AnimationSelectMenu />
        <ArtboardSelectMenu />
    </div>
  );
}

export default App;