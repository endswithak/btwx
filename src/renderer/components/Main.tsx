import React, { ReactElement } from 'react';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import Stage from './Stage';

const Main = (): ReactElement => (
  <div
    id='main'
    className='c-app__main'>
    <SidebarLeft />
    <Stage />
    <SidebarRight />
  </div>
);

export default Main;