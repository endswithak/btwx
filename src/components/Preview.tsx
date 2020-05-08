import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import PreviewCanvas from './PreviewCanvas';

const Preview = (): ReactElement => {
  const preview = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-app'
      ref={preview}
      style={{
        background: theme.background.z0
      }}>
      <div className='c-app__canvas'>
        <PreviewCanvas />
      </div>
    </div>
  );
}

export default Preview;