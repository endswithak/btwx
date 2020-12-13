import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

const IntersectButton = (): ReactElement => {
  const canIntersect = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleIntersectClick = (): void => {
    if (canIntersect) {
      dispatch(applyBooleanOperationThunk('intersect'));
    }
  }

  return (
    <TopbarButton
      label='Intersect'
      onClick={handleIntersectClick}
      icon='intersect'
      disabled={!canIntersect} />
  );
}

export default IntersectButton;