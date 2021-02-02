import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignLayersToBottom } from '../store/actions/layer';
import { getSelectedBottom } from '../store/selectors/layer';
import IconButton from './IconButton';

const AlignBottomToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedBottom = useSelector((state: RootState) => getSelectedBottom(state));
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToBottom({layers: selected}))}
      icon='align-bottom'
      disabled={selected.length <= 1 || selectedBottom !== 'multi'} />
  );
}

export default AlignBottomToggle;