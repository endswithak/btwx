import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import Canvas from './Canvas';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import TweenDrawer from './TweenDrawer';
import TextEditor from './TextEditor';
import { ThemeContext } from './ThemeProvider';

const Main = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className='c-app__main'>
      <SidebarLeft />
      <div className='c-app__canvas'>
        <Canvas />
        <TweenDrawer />
        <TextEditor />
      </div>
      <SidebarRight />
    </div>
  );
}

export default Main;