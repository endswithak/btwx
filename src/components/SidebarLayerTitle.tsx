import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { addLayerToSelection, newSelection, removeLayerFromSelection } from '../store/actions/selection';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerTitleProps {
  layer: em.Layer;
  addLayerToSelection?(id: string): any;
  removeLayerFromSelection?(id: string): any;
  newSelection?(id: string): any;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, addLayerToSelection, removeLayerFromSelection, newSelection } = props;

  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      if (layer.selected) {
        removeLayerFromSelection(layer.id);
      } else {
        addLayerToSelection(layer.id);
      }
    } else {
      newSelection(layer.id);
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
  { addLayerToSelection, newSelection, removeLayerFromSelection }
)(SidebarLayerTitle);