import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import StackedButton from './StackedButton';

const ExcludeButton = (): ReactElement => {
  const canExclude = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleExcludeClick = (): void => {
    if (canExclude) {
      dispatch(applyBooleanOperationThunk('exclude'));
    }
  }

  return (
    <StackedButton
      label='Difference'
      onClick={handleExcludeClick}
      iconName='exclude'
      disabled={!canExclude}
      size='small' />
  );
}

export default ExcludeButton;