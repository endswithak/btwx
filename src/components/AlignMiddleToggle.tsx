import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToMiddlePayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToMiddle } from '../store/actions/layer';
import IconButton from './IconButton';

interface AlignMiddleToggleProps {
  selected?: string[];
  alignLayersToMiddle?(payload: AlignLayersToMiddlePayload): LayerTypes;
}

const AlignMiddleToggle = (props: AlignMiddleToggleProps): ReactElement => {
  const { selected, alignLayersToMiddle } = props;

  return (
    <IconButton
      onClick={() => alignLayersToMiddle({layers: selected})}
      icon='M15,5.001 L15,10.999 L15,10.999 L21,11 L21,12 L15,11.999 L15,18 L9,18 L9,12 L3,12 L3,11 L9,11 L9,5 L14.999,5 C14.9995523,5 15,5.00044772 15,5.001 Z'
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
  { alignLayersToMiddle }
)(AlignMiddleToggle);