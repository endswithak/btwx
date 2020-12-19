import React, { useContext, ReactElement, useState } from 'react';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import { ThemeContext } from './ThemeProvider';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import ContextMenuWrap from './ContextMenuWrap';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import EventDrawer from './EventDrawer';
import TextEditor from './TextEditor';

const App = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const [ready, setReady] = useState(false);

  return (
    <div
      id='app'
      className='c-app'
      style={{
        background: theme.background.z0
      }}>
        {/* flex items */}
        <Topbar />
        <div id='main' className='c-app__main'>
          <SidebarLeft ready={ready} />
          <main id='main-canvas' className='c-app__canvas'>
            <Canvas setReady={setReady} ready={ready} />
            <TextEditor ready={ready} />
            <EventDrawer ready={ready} />
          </main>
          <SidebarRight ready={ready} />
        </div>
        {/* abs elements */}
        {
          ready
          ? <>
              <ContextMenuWrap />
              <EaseEditorWrap />
              <ArtboardPresetEditorWrap />
            </>
          : null
        }
    </div>
  );
}

export default App;