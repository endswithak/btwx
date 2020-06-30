import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { DistributeLayersVerticallyPayload, LayerTypes } from '../store/actionTypes/layer';
import { distributeLayersVertically } from '../store/actions/layer';
import IconButton from './IconButton';

interface DistributeVerticallyToggleProps {
  selected?: string[];
  distributeLayersVertically?(payload: DistributeLayersVerticallyPayload): LayerTypes;
}

const DistributeVerticallyToggle = (props: DistributeVerticallyToggleProps): ReactElement => {
  const { selected, distributeLayersVertically } = props;

  return (
    <IconButton
      onClick={() => distributeLayersVertically({layers: selected})}
      icon='M21,19 L21,20 L3,20 L3,19 L21,19 Z M18,9 L18,15 L6,15 L6,9 L18,9 Z M21,4 L21,5 L3,5 L3,4 L21,4 Z'
      disabled={selected.length <= 2}
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
  { distributeLayersVertically }
)(DistributeVerticallyToggle);