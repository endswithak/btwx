import React, { useContext, ReactElement, useState, useEffect } from 'react';
import paper from 'paper';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import Main from './Main';
import { ThemeContext } from './ThemeProvider';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import ContextMenuWrap from './ContextMenuWrap';

const App = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const [ready, setReady] = useState(false);

  // const handleResize = (): void => {
  //   const canvasWrap = document.getElementById('canvas-container');
  //   paperMain.projects.forEach((project) => {
  //     project.view.viewSize = new paperMain.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
  //   });
  // }

  // useEffect(() => {
  //   console.log(paper.PaperScope.get(0).view.matrix.values);
  //   console.log(paper.PaperScope.get(1).view.matrix.values);
  //   console.log(paper.PaperScope.get(2).view.matrix.values);
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   }
  // }, []);

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
              {/* Modals */}
              {/* <EaseEditorWrap /> */}
              {/* <ArtboardPresetEditorWrap />
              <ContextMenuWrap /> */}
            </>
          : null
        }
    </div>
  );
}

export default App;