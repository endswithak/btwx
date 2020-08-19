import { remote } from 'electron';
import React, { useContext, ReactElement } from 'react';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import TweenDrawer from './TweenDrawer';
import TextEditor from './TextEditor';
import InsertKnob from './InsertKnob';

interface MainProps {
  ready: boolean;
  setReady(ready: boolean): void;
}

const Main = (props: MainProps): ReactElement => {
  const { ready, setReady } = props;
  return (
    <div
      id='main'
      className='c-app__main'>
      <SidebarLeft ready={ready} />
      <div
        id='main-canvas'
        className='c-app__canvas'>
        <Canvas setReady={setReady} />
        <TweenDrawer ready={ready} />
        <TextEditor ready={ready} />
        {
          remote.process.platform === 'darwin'
          ? <InsertKnob />
          : null
        }
      </div>
      <SidebarRight ready={ready} />
    </div>
  );
}

export default Main;