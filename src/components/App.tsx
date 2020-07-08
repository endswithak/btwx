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
import FillEditorWrap from './FillEditorWrap';
import StrokeEditor from './StrokeEditor';
import TextEditor from './TextEditor';
import Main from './Main';
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
        <Main />
        <TweenEventSelect />
        <TweenEventDestinationSelect />
        <EaseEditor />
        <StrokeEditor />
    </div>
  );
}

export default App;