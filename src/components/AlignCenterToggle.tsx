import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToCenterPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToCenter } from '../store/actions/layer';
import IconButton from './IconButton';

const AlignCenterToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToCenter({layers: selected}))}
      icon='align-center'
      disabled={selected.length <= 1}
      variant='medium' />
  );
}

export default AlignCenterToggle;