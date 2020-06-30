import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToBottomPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToBottom } from '../store/actions/layer';
import IconButton from './IconButton';

interface AlignBottomToggleProps {
  selected?: string[];
  alignLayersToBottom?(payload: AlignLayersToBottomPayload): LayerTypes;
}

const AlignBottomToggle = (props: AlignBottomToggleProps): ReactElement => {
  const { selected, alignLayersToBottom } = props;

  return (
    <IconButton
      onClick={() => alignLayersToBottom({layers: selected})}
      icon='M21,19 L21,20 L3,20 L3,19 L21,19 Z M15,5 L15,17 L9,17 L9,5 L15,5 Z'
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
  { alignLayersToBottom }
)(AlignBottomToggle);