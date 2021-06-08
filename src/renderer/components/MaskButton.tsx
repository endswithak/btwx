import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { addSelectionMaskThunk } from '../store/actions/layer';
import { canMaskSelected } from '../store/selectors/layer';
import StackedButton from './StackedButton';
import Icon from './Icon';

const MaskButton = (): ReactElement => {
  const canMask = useSelector((state: RootState) => canMaskSelected(state));
  const dispatch = useDispatch();

  const handleMaskClick = (): void => {
    if (canMask) {
      dispatch(addSelectionMaskThunk());
    }
  }

  return (
    <StackedButton
      label='Mask'
      onClick={handleMaskClick}
      disabled={!canMask}
      size='small'>
      <Icon
        size='small'
        name='mask' />
    </StackedButton>
  );
}

export default MaskButton;