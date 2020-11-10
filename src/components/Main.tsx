import { remote } from 'electron';
import React, { ReactElement, useEffect } from 'react';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import TweenDrawerWrap from './TweenDrawerWrap';
import TextEditor from './TextEditor';
import InsertKnobWrap from './InsertKnobWrap';

interface MainProps {
  ready: boolean;
  setReady(ready: boolean): void;
}

const Main = (props: MainProps): ReactElement => {
  const { ready, setReady } = props;

  useEffect(() => {
    console.log('MAIN');
  }, []);

  return (
    <div
      id='main'
      className='c-app__main'>
      <SidebarLeft ready={ready} />
      <div
        id='main-canvas'
        className='c-app__canvas'>
        <Canvas setReady={setReady} ready={ready} />
        {/* <TweenDrawerWrap ready={ready} /> */}
        <TextEditor ready={ready} />
        <InsertKnobWrap />
      </div>
      <SidebarRight ready={ready} />
    </div>
  );
}

export default Main;