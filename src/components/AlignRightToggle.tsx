import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignLayersToRight } from '../store/actions/layer';
import IconButton from './IconButton';

const AlignRightToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToRight({layers: selected}))}
      icon='align-right'
      disabled={selected.length <= 1}
      variant='medium' />
  );
}

export default AlignRightToggle;