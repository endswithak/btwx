import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import Topbar from './Topbar';
import TweenDrawer from './TweenDrawer';
import TweenEventSelect from './TweenEventSelect';
import TweenEventDestinationSelect from './TweenEventDestinationSelect';
import EaseEditor from './EaseEditor';
import FillEditor from './FillEditor';
import StrokeEditor from './StrokeEditor';
import TextEditor from './TextEditor';
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
          <SidebarLeft />
          <div className='c-app__main'>
            <Canvas />
            <TweenDrawer />
            <TextEditor />
          </div>
          <SidebarRight />
        </div>
        <TweenEventSelect />
        <TweenEventDestinationSelect />
        <EaseEditor />
        <FillEditor />
        <StrokeEditor />
    </div>
  );
}

export default App;