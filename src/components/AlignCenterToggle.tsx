import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToCenterPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToCenter } from '../store/actions/layer';
import IconButton from './IconButton';

interface AlignCenterToggleProps {
  selected?: string[];
  alignLayersToCenter?(payload: AlignLayersToCenterPayload): LayerTypes;
}

const AlignCenterToggle = (props: AlignCenterToggleProps): ReactElement => {
  const { selected, alignLayersToCenter } = props;

  return (
    <IconButton
      onClick={() => alignLayersToCenter({layers: selected})}
      icon='M12,3 L12,9 L17.999,9 C17.9995523,9 18,9.00044772 18,9.001 L18,15 L18,15 L12,15 L12,21 L11,21 L11,15 L5,15 L5,9 L11,9 L11,3 L12,3 Z'
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
  { alignLayersToCenter }
)(AlignCenterToggle);