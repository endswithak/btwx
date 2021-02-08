import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeLayersVertically } from '../store/actions/layer';
import IconButton from './IconButton';

const DistributeVerticallyToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(distributeLayersVertically({layers: selected}))}
      iconName='distribute-vertically'
      disabled={selected.length <= 2} />
  );
}

export default DistributeVerticallyToggle;