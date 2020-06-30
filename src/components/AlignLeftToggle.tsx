import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToLeftPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToLeft } from '../store/actions/layer';
import IconButton from './IconButton';

interface AlignLeftToggleProps {
  selected?: string[];
  alignLayersToLeft?(payload: AlignLayersToLeftPayload): LayerTypes;
}

const AlignLeftToggle = (props: AlignLeftToggleProps): ReactElement => {
  const { selected, alignLayersToLeft } = props;

  return (
    <IconButton
      onClick={() => alignLayersToLeft({layers: selected})}
      icon='M5,3 L5,21 L4,21 L4,3 L5,3 Z M19,9 L19,15 L7,15 L7,9 L19,9 Z'
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