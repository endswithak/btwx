import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToTopPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToTop } from '../store/actions/layer';
import IconButton from './IconButton';

interface AlignTopToggleProps {
  selected?: string[];
  alignLayersToTop?(payload: AlignLayersToTopPayload): LayerTypes;
}

const AlignTopToggle = (props: AlignTopToggleProps): ReactElement => {
  const { selected, alignLayersToTop } = props;

  return (
    <IconButton
      onClick={() => alignLayersToTop({layers: selected})}
      icon='M15,7 L15,19 L9,19 L9,7 L15,7 Z M21,4 L21,5 L3,5 L3,4 L21,4 Z'
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