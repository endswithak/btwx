import React, { useContext, ReactElement } from 'react';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import TweenDrawer from './TweenDrawer';
import TextEditor from './TextEditor';

const Main = (): ReactElement => {
  return (
    <div
      id='main'
      className='c-app__main'>
      <SidebarLeft />
      <div
        id='main-canvas'
        className='c-app__canvas'>
        <Canvas />
        <TweenDrawer />
        <TextEditor />
      </div>
      <SidebarRight />
    </div>
  );
}

export default Main;