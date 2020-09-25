import React, { useContext, ReactElement, useState } from 'react';
import Topbar from './Topbar';
import TopbarTitle from './TopbarTitle';
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
import KeyBindings from './KeyBindings';
import ShapeToolWrap from './ShapeToolWrap';
import ArtboardToolWrap from './ArtboardToolWrap';
import TextToolWrap from './TextToolWrap';

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
        <TopbarTitle />
        {/* flex items */}
        <Topbar />
        <Main ready={ready} setReady={setReady} />
        {/* modals */}
        {
          ready
          ? <>
              <EaseEditorWrap />
              <ActiveArtboardFrameWrap />
              <HoverFrameWrap />
              <SelectionFrameWrap />
              <MeasureFrameWrap />
              <ArtboardPresetEditorWrap />
              <ContextMenuWrap />
              <TweenEventsFrameWrap />
              <KeyBindings />
              <ShapeToolWrap />
              <ArtboardToolWrap />
              <TextToolWrap />
            </>
          : null
        }
    </div>
  );
}

export default App;