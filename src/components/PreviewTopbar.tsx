import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { PREVIEW_TOPBAR_HEIGHT } from '../constants';
import PreviewRewindButton from './PreviewRewindButton';
import PreviewRecordButton from './PreviewRecordButton';

const PreviewTopbar = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-preview-topbar'
      style={{
        height: PREVIEW_TOPBAR_HEIGHT,
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <PreviewRewindButton />
      <PreviewRecordButton />
    </div>
  );
}

export default PreviewTopbar;