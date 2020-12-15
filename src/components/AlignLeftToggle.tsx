import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignLayersToLeft } from '../store/actions/layer';
import IconButton from './IconButton';

const AlignLeftToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToLeft({layers: selected}))}
      icon='align-left'
      disabled={selected.length <= 1}
      variant='medium' />
  );
}

export default AlignLeftToggle;