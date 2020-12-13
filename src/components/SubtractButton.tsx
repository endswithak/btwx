import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canBooleanSelected } from '../store/selectors/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

const SubtractButton = (): ReactElement => {
  const canSubtract = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleSubtractClick = (): void => {
    if (canSubtract) {
      dispatch(applyBooleanOperationThunk('subtract'));
    }
  }

  return (
    <TopbarButton
      label='Subtract'
      onClick={handleSubtractClick}
      icon='subtract'
      disabled={!canSubtract} />
  );
}

export default SubtractButton;