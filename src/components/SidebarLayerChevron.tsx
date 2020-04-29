import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { expandLayer, collapseLayer } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import { ExpandLayerPayload, CollapseLayerPayload, LayerTypes } from '../store/actionTypes/layer';

interface SidebarLayerChevronProps {
  layer: em.Layer;
  expandLayer(payload: ExpandLayerPayload): LayerTypes;
  collapseLayer(payload: CollapseLayerPayload): LayerTypes;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, expandLayer, collapseLayer } = props;

  const handleChevronClick = (): void => {
    if (layer.type === 'Group') {
      if ((layer as em.Group).expanded) {
        collapseLayer({id: layer.id});
      } else {
        expandLayer({id: layer.id});
      }
    }
  }

  return (
    layer.type === 'Group'
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
            (layer as em.Group).expanded
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
  { expandLayer, collapseLayer }
)(SidebarLayerChevron);