import React, { ReactElement } from 'react';
import PreviewCanvas from './PreviewCanvas';
import PreviewTopbar from './PreviewTopbar';

const PreviewMain = (): ReactElement => (
  <>
    <PreviewTopbar />
    <div className='c-app__canvas'>
      <PreviewCanvas />
    </div>
    <video
      id='preview-video'
      style={{
      position: 'absolute',
      opacity: 0
    }} />
  </>
);

export default PreviewMain;