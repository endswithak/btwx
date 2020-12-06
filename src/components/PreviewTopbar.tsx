import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { PREVIEW_TOPBAR_HEIGHT } from '../constants';
import PreviewRewindButton from './PreviewRewindButton';
import PreviewTouchCursorButton from './PreviewTouchCursorButton';
import PreviewRecordButton from './PreviewRecordButton';

interface PreviewTopbarProps {
  touchCursor: boolean;
  setTouchCursor(touchCursor: boolean): void;
}

const PreviewTopbar = (props: PreviewTopbarProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { touchCursor, setTouchCursor } = props;

  return (
    <div
      className='c-preview-topbar'
      style={{
        height: PREVIEW_TOPBAR_HEIGHT,
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <PreviewRewindButton />
      <PreviewTouchCursorButton
        touchCursor={touchCursor}
        setTouchCursor={setTouchCursor} />
      <PreviewRecordButton />
    </div>
  );
}

export default PreviewTopbar;