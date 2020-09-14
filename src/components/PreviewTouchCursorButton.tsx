import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableTouchCursor, disableTouchCursor } from '../store/actions/preview';
import { PreviewTypes } from '../store/actionTypes/preview';
import TopbarButton from './TopbarButton';

interface PreviewTouchCursorButtonProps {
  touchCursor: boolean;
  enableTouchCursor(): PreviewTypes;
  disableTouchCursor(): PreviewTypes;
}

const PreviewTouchCursorButton = (props: PreviewTouchCursorButtonProps): ReactElement => {
  const { touchCursor, enableTouchCursor, disableTouchCursor } = props;

  const handleClick = () => {
    if (touchCursor) {
      disableTouchCursor();
    } else {
      enableTouchCursor();
    }
  }

  return (
    <TopbarButton
      onClick={handleClick}
      icon='touch-cursor'
      isActive={touchCursor} />
  );
}

const mapStateToProps = (state: RootState): {
  touchCursor: boolean;
} => {
  const { preview } = state;
  const touchCursor = preview.touchCursor;
  return { touchCursor };
};

export default connect(
  mapStateToProps,
  { enableTouchCursor, disableTouchCursor }
)(PreviewTouchCursorButton);