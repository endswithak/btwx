import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import Topbar from './Topbar';
import EaseEditor from './EaseEditor';
import Main from './Main';
import { ThemeContext } from './ThemeProvider';
import ActiveArtboardFrameWrap from './ActiveArtboardFrameWrap';
import SelectionFrameWrap from './SelectionFrameWrap';
import HoverFrameWrap from './HoverFrameWrap';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import ContextMenuWrap from './ContextMenuWrap';

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
        {/* flex items */}
        <Topbar />
        <Main />
        {/* modals */}
        <EaseEditor />
        <ActiveArtboardFrameWrap />
        <HoverFrameWrap />
        <SelectionFrameWrap />
        <ArtboardPresetEditorWrap />
        <ContextMenuWrap />
    </div>
  );
}

export default App;