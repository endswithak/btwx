import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canBooleanSelected } from '../store/selectors/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

const UniteButton = (): ReactElement => {
  const canUnite = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleUniteClick = (): void => {
    if (canUnite) {
      dispatch(applyBooleanOperationThunk('unite'));
    }
  }

  return (
    <TopbarButton
      label='Union'
      onClick={handleUniteClick}
      icon='unite'
      disabled={!canUnite} />
  );
}

export default UniteButton;