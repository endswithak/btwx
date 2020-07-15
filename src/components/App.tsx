import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import Topbar from './Topbar';
import TweenEventSelect from './TweenEventSelect';
import TweenEventDestinationSelect from './TweenEventDestinationSelect';
import EaseEditor from './EaseEditor';
import StrokeEditor from './StrokeEditor';
import Main from './Main';
import { ThemeContext } from './ThemeProvider';
import SelectionFrameWrap from './SelectionFrameWrap';
import HoverFrameWrap from './HoverFrameWrap';

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
        <HoverFrameWrap />
        <SelectionFrameWrap />
    </div>
  );
}

export default App;