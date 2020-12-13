import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canSendSelectedBackward } from '../store/selectors/layer';
import { sendSelectedBackwardThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

const MoveBackwardButton = (): ReactElement => {
  const canMoveBackward = useSelector((state: RootState) => canSendSelectedBackward(state));
  const dispatch = useDispatch();

  const handleMoveBackwardClick = (): void => {
    if (canMoveBackward) {
      dispatch(sendSelectedBackwardThunk());
    }
  }

  return (
    <TopbarButton
      label='Backward'
      onClick={handleMoveBackwardClick}
      icon='move-backward'
      disabled={!canMoveBackward} />
  );
}

export default MoveBackwardButton;