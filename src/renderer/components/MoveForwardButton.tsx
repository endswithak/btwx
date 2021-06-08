import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedForwardThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';
import StackedButton from './StackedButton';
import Icon from './Icon';

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
      disabled={!canMoveForward}
      size='small'>
      <Icon
        size='small'
        name='bring-forward' />
    </StackedButton>
  );
}

export default MoveForwardButton;