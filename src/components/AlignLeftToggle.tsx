import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToLeftPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToLeft } from '../store/actions/layer';
import IconButton from './IconButton';
import Icon from './Icon';

interface AlignLeftToggleProps {
  selected?: string[];
  alignLayersToLeft?(payload: AlignLayersToLeftPayload): LayerTypes;
}

const AlignLeftToggle = (props: AlignLeftToggleProps): ReactElement => {
  const { selected, alignLayersToLeft } = props;

  return (
    <IconButton
      onClick={() => alignLayersToLeft({layers: selected})}
      icon={Icon('align-left')}
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
  { alignLayersToLeft }
)(AlignLeftToggle);