import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import Canvas from './Canvas';
import LayersSidebar from './LayersSidebar';
import StylesSidebar from './StylesSidebar';
import Topbar from './Topbar';
import AnimationSelect from './AnimationSelect';
import { ThemeContext } from './ThemeProvider';

const App = (): ReactElement => {
  const app = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-app'
      ref={app}
      style={{
        background: theme.background.z0
      }}>
        <Topbar />
        <div className='c-app__canvas'>
          <LayersSidebar />
          <Canvas />
        </div>
        <AnimationSelect />
    </div>
  );
}

export default App;