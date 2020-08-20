import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToTopPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToTop } from '../store/actions/layer';
import IconButton from './IconButton';
import Icon from './Icon';

interface AlignTopToggleProps {
  selected?: string[];
  alignLayersToTop?(payload: AlignLayersToTopPayload): LayerTypes;
}

const AlignTopToggle = (props: AlignTopToggleProps): ReactElement => {
  const { selected, alignLayersToTop } = props;

  return (
    <IconButton
      onClick={() => alignLayersToTop({layers: selected})}
      icon={Icon('align-top')}
      disabled={selected.length <= 1}
      variant='medium' />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  return { selected };
};

export default connect(
  mapStateToProps,
  { alignLayersToTop }
)(AlignTopToggle);