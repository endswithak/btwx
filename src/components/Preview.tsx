import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import PreviewCanvas from './PreviewCanvas';
import PreviewTopbar from './PreviewTopbar';

const Preview = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-app'
      style={{
        background: theme.background.z0
      }}>
      <PreviewTopbar />
      <div className='c-app__canvas'>
        <PreviewCanvas />
      </div>
    </div>
  );
}

export default Preview;