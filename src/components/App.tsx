import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import Canvas from './Canvas';
import LayersSidebar from './LayersSidebar';
import StylesSidebar from './StylesSidebar';
import Topbar from './Topbar';
import TweenDrawer from './TweenDrawer';
import TweenEventSelect from './TweenEventSelect';
import TweenEventDestinationSelect from './TweenEventDestinationSelect';
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
            <TweenDrawer />
          </div>
        </div>
        <TweenEventSelect />
        <TweenEventDestinationSelect />
    </div>
  );
}

export default App;