import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToRightPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToRight } from '../store/actions/layer';
import IconButton from './IconButton';

interface AlignRightToggleProps {
  selected?: string[];
  alignLayersToRight?(payload: AlignLayersToRightPayload): LayerTypes;
}

const AlignRightToggle = (props: AlignRightToggleProps): ReactElement => {
  const { selected, alignLayersToRight } = props;

  return (
    <IconButton
      onClick={() => alignLayersToRight({layers: selected})}
      icon='M20,3 L20,21 L19,21 L19,3 L20,3 Z M17,9 L17,15 L5,15 L5,9 L17,9 Z'
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
  { alignLayersToRight }
)(AlignRightToggle);