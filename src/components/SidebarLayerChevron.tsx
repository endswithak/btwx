import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { showLayerChildren, hideLayerChildren } from '../store/actions/layer';
import { ShowLayerChildrenPayload, HideLayerChildrenPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerChevronProps {
  layer: em.Layer;
  dragGhost: boolean;
  showLayerChildren(payload: ShowLayerChildrenPayload): LayerTypes;
  hideLayerChildren(payload: HideLayerChildrenPayload): LayerTypes;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, showLayerChildren, hideLayerChildren, dragGhost } = props;

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
        className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
        onClick={handleChevronClick}
        >
        <Icon
          name={(layer as em.Group).showChildren ? 'chevron-down' : 'chevron-right'}
          style={{
            fill: layer.selected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          }} />
      </div>
    : <div className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron' />
  );
}

export default connect(
  null,
  { showLayerChildren, hideLayerChildren }
)(SidebarLayerChevron);