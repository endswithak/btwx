import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canBooleanSelected } from '../store/selectors/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import StackedButton from './StackedButton';

const UniteButton = (): ReactElement => {
  const canUnite = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleUniteClick = (): void => {
    if (canUnite) {
      dispatch(applyBooleanOperationThunk('unite'));
    }
  }

  return (
    <StackedButton
      label='Union'
      onClick={handleUniteClick}
      iconName='unite'
      disabled={!canUnite}
      size='small' />
  );
}

export default UniteButton;