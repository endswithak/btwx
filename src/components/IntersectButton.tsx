import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import StackedButton from './StackedButton';

const IntersectButton = (): ReactElement => {
  const canIntersect = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleIntersectClick = (): void => {
    if (canIntersect) {
      dispatch(applyBooleanOperationThunk('intersect'));
    }
  }

  return (
    <StackedButton
      label='Intersect'
      onClick={handleIntersectClick}
      iconName='intersect'
      disabled={!canIntersect}
      size='small' />
  );
}

export default IntersectButton;