import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignLayersToTop } from '../store/actions/layer';
import { getSelectedTop } from '../store/selectors/layer';
import IconButton from './IconButton';

const AlignTopToggle = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedTop = useSelector((state: RootState) => getSelectedTop(state));
  const dispatch = useDispatch();

  return (
    <IconButton
      onClick={() => dispatch(alignLayersToTop({layers: selected}))}
      icon='align-top'
      disabled={selected.length <= 1 || selectedTop !== 'multi'}
      variant='medium' />
  );
}

export default AlignTopToggle;