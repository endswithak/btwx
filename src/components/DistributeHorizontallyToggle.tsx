import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeLayersHorizontally } from '../store/actions/layer';
import IconButton from './IconButton';

const DistributeHorizontallyToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(distributeLayersHorizontally({layers: selected}))}
      icon='distribute-horizontally'
      disabled={selected.length <= 2} />
  );
}

export default DistributeHorizontallyToggle;