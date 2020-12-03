import React, { useContext, ReactElement, useState } from 'react';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import Main from './Main';
import { ThemeContext } from './ThemeProvider';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import ContextMenuWrap from './ContextMenuWrap';

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
        <Main ready={ready} setReady={setReady} />
        {/* abs elements */}
        {
          ready
          ? <>
              <ContextMenuWrap />
              {/* Canvas UI */}
              {/* Modals */}
              {/* <EaseEditorWrap /> */}
              {/* <ArtboardPresetEditorWrap /> */}
            </>
          : null
        }
    </div>
  );
}

export default App;