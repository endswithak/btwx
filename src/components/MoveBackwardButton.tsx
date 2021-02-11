import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canSendSelectedBackward } from '../store/selectors/layer';
import { sendSelectedBackwardThunk } from '../store/actions/layer';
import StackedButton from './StackedButton';

const MoveBackwardButton = (): ReactElement => {
  const canMoveBackward = useSelector((state: RootState) => canSendSelectedBackward(state));
  const dispatch = useDispatch();

  const handleMoveBackwardClick = (): void => {
    if (canMoveBackward) {
      dispatch(sendSelectedBackwardThunk());
    }
  }

  return (
    <StackedButton
      label='Backward'
      onClick={handleMoveBackwardClick}
      iconName='move-backward'
      disabled={!canMoveBackward}
      size='small' />
  );
}

export default MoveBackwardButton;