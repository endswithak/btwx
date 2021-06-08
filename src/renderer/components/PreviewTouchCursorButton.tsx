import React, { ReactElement } from 'react';
import IconButton from './IconButton';

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
    <IconButton
      size='small'
      onClick={handleClick}
      isActive={touchCursor}
      iconName='touch-cursor'
      toggle />
    // <TopbarButton
    //   onClick={handleClick}
    //   icon='touch-cursor'
    //   isActive={touchCursor} />
  );
}

export default PreviewTouchCursorButton;