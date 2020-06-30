import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { DistributeLayersHorizontallyPayload, LayerTypes } from '../store/actionTypes/layer';
import { distributeLayersHorizontally } from '../store/actions/layer';
import IconButton from './IconButton';

interface DistributeHorizontallyToggleProps {
  selected?: string[];
  distributeLayersHorizontally?(payload: DistributeLayersHorizontallyPayload): LayerTypes;
}

const DistributeHorizontallyToggle = (props: DistributeHorizontallyToggleProps): ReactElement => {
  const { selected, distributeLayersHorizontally } = props;

  return (
    <IconButton
      onClick={() => distributeLayersHorizontally({layers: selected})}
      icon='M5,3 L5,21 L4,21 L4,3 L5,3 Z M20,3 L20,21 L19,21 L19,3 L20,3 Z M15,6 L15,18 L9,18 L9,6 L15,6 Z'
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
  { distributeLayersHorizontally }
)(DistributeHorizontallyToggle);