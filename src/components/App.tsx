import React, { useRef, useContext, ReactElement, useState } from 'react';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import Main from './Main';
import { ThemeContext } from './ThemeProvider';
import ActiveArtboardFrameWrap from './ActiveArtboardFrameWrap';
import SelectionFrameWrap from './SelectionFrameWrap';
import TweenEventFrameWrap from './TweenEventFrameWrap';
import HoverFrameWrap from './HoverFrameWrap';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import ContextMenuWrap from './ContextMenuWrap';

const App = (): ReactElement => {
  const app = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const [ready, setReady] = useState(false);

  return (
    <div
      id='app'
      className='c-app'
      ref={app}
      style={{
        background: theme.background.z0
      }}>
        {/* flex items */}
        <Topbar />
        <Main ready={ready} setReady={setReady} />
        {/* modals */}
        <EaseEditorWrap />
        <ActiveArtboardFrameWrap />
        <HoverFrameWrap />
        <SelectionFrameWrap />
        <ArtboardPresetEditorWrap />
        <ContextMenuWrap />
        <TweenEventFrameWrap />
    </div>
  );
}

export default App;