import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignLayersToLeft } from '../store/actions/layer';
import { getSelectedLeft } from '../store/selectors/layer';
import IconButton from './IconButton';

const AlignLeftToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedLeft = useSelector((state: RootState) => getSelectedLeft(state));
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToLeft({layers: selected}))}
      iconName='align-left'
      disabled={selected.length <= 1 || selectedLeft !== 'multi'} />
  );
}

export default AlignLeftToggle;