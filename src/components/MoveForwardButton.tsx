import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedForwardThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';
import StackedButton from './StackedButton';

const MoveForwardButton = (): ReactElement => {
  const canMoveForward = useSelector((state: RootState) => canBringSelectedForward(state));
  const dispatch = useDispatch();

  const handleMoveForwardClick = (): void => {
    if (canMoveForward) {
      dispatch(bringSelectedForwardThunk());
    }
  }

  return (
    <StackedButton
      label='Forward'
      onClick={handleMoveForwardClick}
      iconName='move-forward'
      disabled={!canMoveForward}
      size='small' />
  );
}

export default MoveForwardButton;