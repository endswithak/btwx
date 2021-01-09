import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedCenter } from '../store/selectors/layer';
import { alignLayersToCenter } from '../store/actions/layer';
import IconButton from './IconButton';

const AlignCenterToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedCenter = useSelector((state: RootState) => getSelectedCenter(state));
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToCenter({layers: selected}))}
      icon='align-center'
      disabled={selected.length <= 1 || selectedCenter !== 'multi'}
      variant='medium' />
  );
}

export default AlignCenterToggle;