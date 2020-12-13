import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { addSelectionMaskThunk } from '../store/actions/layer';
import { canMaskSelected } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

const MaskButton = (): ReactElement => {
  const canMask = useSelector((state: RootState) => canMaskSelected(state));
  const dispatch = useDispatch();

  const handleMaskClick = (): void => {
    if (canMask) {
      dispatch(addSelectionMaskThunk());
    }
  }

  return (
    <TopbarButton
      label='Mask'
      onClick={handleMaskClick}
      icon='mask'
      disabled={!canMask} />
  );
}

export default MaskButton;