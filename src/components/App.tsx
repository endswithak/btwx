import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { paperMain } from '../canvas';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import Main from './Main';
import { ThemeContext } from './ThemeProvider';
import ActiveArtboardFrameWrap from './ActiveArtboardFrameWrap';
import SelectionFrameWrap from './SelectionFrameWrap';
import MeasureFrameWrap from './MeasureFrameWrap';
import TweenEventsFrameWrap from './TweenEventsFrameWrap';
import HoverFrameWrap from './HoverFrameWrap';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import ContextMenuWrap from './ContextMenuWrap';

const App = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const [ready, setReady] = useState(false);

  const handleResize = (): void => {
    const canvasWrap = document.getElementById('canvas-container');
    paperMain.view.viewSize = new paperMain.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

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
              {/* Canvas UI */}
              <ActiveArtboardFrameWrap />
              <HoverFrameWrap />
              <SelectionFrameWrap />
              <MeasureFrameWrap />
              <TweenEventsFrameWrap />
              {/* Modals */}
              {/* <EaseEditorWrap /> */}
              <ArtboardPresetEditorWrap />
              <ContextMenuWrap />
            </>
          : null
        }
    </div>
  );
}

export default App;