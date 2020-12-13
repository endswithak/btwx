import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedForwardThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

const MoveForwardButton = (): ReactElement => {
  const canMoveForward = useSelector((state: RootState) => canBringSelectedForward(state));
  const dispatch = useDispatch();

  const handleMoveForwardClick = (): void => {
    if (canMoveForward) {
      dispatch(bringSelectedForwardThunk());
    }
  }

  return (
    <TopbarButton
      label='Forward'
      onClick={handleMoveForwardClick}
      icon='move-forward'
      disabled={!canMoveForward} />
  );
}

export default MoveForwardButton;