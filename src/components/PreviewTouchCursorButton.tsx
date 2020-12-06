import React, { ReactElement } from 'react';
import TopbarButton from './TopbarButton';

interface PreviewTouchCursorButtonProps {
  touchCursor: boolean;
  setTouchCursor(touchCursor: boolean): void;
}

const PreviewTouchCursorButton = (props: PreviewTouchCursorButtonProps): ReactElement => {
  const { touchCursor, setTouchCursor } = props;

  const handleClick = () => {
    setTouchCursor(!touchCursor);
  }

  return (
    <TopbarButton
      onClick={handleClick}
      icon='touch-cursor'
      isActive={touchCursor} />
  );
}

export default PreviewTouchCursorButton;