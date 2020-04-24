import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { addToSelection, newSelection, removeFromSelection } from '../store/actions/layers';
import { ThemeContext } from './ThemeProvider';
import { SelectionPayload, LayersTypes } from '../store/actionTypes/layers';

interface SidebarLayerTitleProps {
  layer: em.Layer;
  addToSelection?(payload: SelectionPayload): LayersTypes;
  removeFromSelection?(payload: SelectionPayload): LayersTypes;
  newSelection?(payload: SelectionPayload): LayersTypes;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, addToSelection, removeFromSelection, newSelection } = props;

  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      if (layer.selected) {
        removeFromSelection({id: layer.id});
      } else {
        addToSelection({id: layer.id});
      }
    } else {
      newSelection({id: layer.id});
    }
  }

  return (
    <div
      className='c-sidebar-layer__name'
      style={{
        color: layer.selected
        ? theme.text.onPrimary
        : theme.text.base
      }}
      onClick={handleClick}
      >
      {layer.name}
    </div>
  );
}

export default connect(
  null,
  { addToSelection, removeFromSelection, newSelection }
)(SidebarLayerTitle);