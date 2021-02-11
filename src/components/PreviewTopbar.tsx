import React, { ReactElement } from 'react';
import { PREVIEW_TOPBAR_HEIGHT } from '../constants';
import PreviewRewindButton from './PreviewRewindButton';
import PreviewTouchCursorButton from './PreviewTouchCursorButton';
import PreviewRecordButton from './PreviewRecordButton';

interface PreviewTopbarProps {
  touchCursor: boolean;
  setTouchCursor(touchCursor: boolean): void;
}

const PreviewTopbar = ({
  touchCursor,
  setTouchCursor
}: PreviewTopbarProps): ReactElement => (
  <div
    className='c-preview-topbar'
    style={{
      height: PREVIEW_TOPBAR_HEIGHT
    }}>
    <PreviewRewindButton />
    <PreviewTouchCursorButton
      touchCursor={touchCursor}
      setTouchCursor={setTouchCursor} />
    {/* <PreviewRecordButton /> */}
  </div>
);

export default PreviewTopbar;