import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';
import LayerNode from '../canvas/base/layerNode';

interface SidebarLayerTitleProps {
  layer: LayerNode;
}

const SidebarLayerTitle = (props: SidebarLayerTitleProps): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch } = globalState;
  const {layer} = props;

  const handleNameClick = (e: any): void => {
    if (layer.selected && e.metaKey) {
      dispatch({
        type: 'remove-from-selection',
        layer: layer
      });
    } else if (e.metaKey) {
      dispatch({
        type: 'add-to-selection',
        layer: layer
      });
    } else {
      dispatch({
        type: 'new-selection',
        layer: layer
      });
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
      onClick={handleNameClick}>
      {layer.name}
    </div>
  );
}

export default SidebarLayerTitle;