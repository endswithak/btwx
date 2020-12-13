import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

const ExcludeButton = (): ReactElement => {
  const canExclude = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleExcludeClick = (): void => {
    if (canExclude) {
      dispatch(applyBooleanOperationThunk('exclude'));
    }
  }

  return (
    <TopbarButton
      label='Difference'
      onClick={handleExcludeClick}
      icon='exclude'
      disabled={!canExclude} />
  );
}

export default ExcludeButton;