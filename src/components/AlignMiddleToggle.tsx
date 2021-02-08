import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignLayersToMiddle } from '../store/actions/layer';
import { getSelectedMiddle } from '../store/selectors/layer';
import IconButton from './IconButton';

const AlignMiddleToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedMiddle = useSelector((state: RootState) => getSelectedMiddle(state));
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToMiddle({layers: selected}))}
      iconName='align-middle'
      disabled={selected.length <= 1 || selectedMiddle !== 'multi'} />
  );
}

export default AlignMiddleToggle;