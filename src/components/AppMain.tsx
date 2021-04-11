import React, { ReactElement } from 'react';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import EventDrawer from './EventDrawer';
import TextEditor from './TextEditor';

const AppMain = (): ReactElement => (
  <div
    id='main'
    className='c-app__main'>
    <SidebarLeft />
    <main
      id='main-canvas'
      className='c-app__canvas'>
      <Canvas />
      <TextEditor />
      <EventDrawer />
    </main>
    <SidebarRight />
  </div>
);

export default AppMain;