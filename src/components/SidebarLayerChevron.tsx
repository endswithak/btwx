import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { showLayerChildren, hideLayerChildren } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import { ShowLayerChildrenPayload, HideLayerChildrenPayload, LayerTypes } from '../store/actionTypes/layer';

interface SidebarLayerChevronProps {
  layer: em.Layer;
  showLayerChildren(payload: ShowLayerChildrenPayload): LayerTypes;
  hideLayerChildren(payload: HideLayerChildrenPayload): LayerTypes;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, showLayerChildren, hideLayerChildren } = props;

  const handleChevronClick = (): void => {
    if ((layer as em.Group).showChildren) {
      hideLayerChildren({id: layer.id});
    } else {
      showLayerChildren({id: layer.id});
    }
  }

  return (
    layer.type === 'Group' || layer.type === 'Artboard'
    ? <div
        className='c-sidebar-layer__chevron'
        onClick={handleChevronClick}
        >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            fill: layer.selected
            ? theme.text.onPrimary
            : theme.text.lighter
          }}>
          {
            (layer as em.Group).showChildren
            ? <path d="M7 10l5 5 5-5H7z"/>
            : <path d='M10 17l5-5-5-5v10z' />
          }
        </svg>
      </div>
    : <div className='c-sidebar-layer__chevron' />
  );
}

export default connect(
  null,
  { showLayerChildren, hideLayerChildren }
)(SidebarLayerChevron);