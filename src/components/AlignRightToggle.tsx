import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignLayersToRight } from '../store/actions/layer';
import { getSelectedRight } from '../store/selectors/layer';
import IconButton from './IconButton';

const AlignRightToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedRight = useSelector((state: RootState) => getSelectedRight(state));
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToRight({layers: selected}))}
      iconName='align-right'
      disabled={selected.length <= 1 || selectedRight !== 'multi'} />
  );
}

export default AlignRightToggle;