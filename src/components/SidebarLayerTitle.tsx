import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { selectLayer, deselectLayer, newLayerScope } from '../store/actions/layer';
import { SelectLayerPayload, DeselectLayerPayload, NewLayerScopePayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerTitleProps {
  layer: em.Layer;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
  newLayerScope?(payload: NewLayerScopePayload): LayerTypes;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, selectLayer, deselectLayer, newLayerScope } = props;

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey) {
      if (layer.selected) {
        deselectLayer({id: layer.id});
      } else {
        selectLayer({id: layer.id});
      }
    } else {
      selectLayer({id: layer.id, newSelection: true});
    }
    newLayerScope({id: layer.id});
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
  { selectLayer, deselectLayer, newLayerScope }
)(SidebarLayerTitle);