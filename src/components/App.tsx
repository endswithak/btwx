import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { paperMain } from '../canvas';
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
import DragToolWrap from './DragToolWrap';
import AreaSelectToolWrap from './AreaSelectToolWrap';
import ResizeToolWrap from './ResizeToolWrap';
import LineToolWrap from './LineToolWrap';
import GradientToolWrap from './GradientToolWrap';
import TranslateToolWrap from './TranslateToolWrap';
import ZoomToolWrap from './ZoomToolWrap';

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
        <TopbarTitle />
        {/* flex items */}
        <Topbar />
        <Main ready={ready} setReady={setReady} />
        {/* abs elements */}
        {
          ready
          ? <>
              {/* canvas ui */}
              <ActiveArtboardFrameWrap />
              <HoverFrameWrap />
              <SelectionFrameWrap />
              <MeasureFrameWrap />
              <TweenEventsFrameWrap />
              {/* modals */}
              <EaseEditorWrap />
              <ArtboardPresetEditorWrap />
              <ContextMenuWrap />
              {/* tools */}
              <ShapeToolWrap />
              <ArtboardToolWrap />
              <TextToolWrap />
              <DragToolWrap />
              <AreaSelectToolWrap />
              <ResizeToolWrap />
              <LineToolWrap />
              <GradientToolWrap />
              <TranslateToolWrap />
              <ZoomToolWrap />
              {/* misc */}
              <KeyBindings />
            </>
          : null
        }
    </div>
  );
}

export default App;