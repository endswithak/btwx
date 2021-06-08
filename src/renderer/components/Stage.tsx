import React, { ReactElement } from 'react';
import Canvas from './Canvas';
import EventDrawer from './EventDrawer';
import TextEditor from './TextEditor';

const Stage = (): ReactElement => (
  <main
    id='stage'
    className='c-app__stage'>
    <Canvas />
    <TextEditor />
    <EventDrawer />
  </main>
);

export default Stage;