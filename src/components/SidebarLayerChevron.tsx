import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { showLayerChildren, hideLayerChildren } from '../store/actions/layer';
import { ShowLayerChildrenPayload, HideLayerChildrenPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerChevronProps {
  layer: string;
  isDragGhost?: boolean;
  showChildren?: boolean;
  isGroup?: boolean;
  isSelected?: boolean;
  showLayerChildren?(payload: ShowLayerChildrenPayload): LayerTypes;
  hideLayerChildren?(payload: HideLayerChildrenPayload): LayerTypes;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { showChildren, isGroup, isSelected, layer, showLayerChildren, hideLayerChildren, isDragGhost } = props;

  useEffect(() => {
    console.log('LAYER CHEVRON');
  }, []);

  const handleChevronClick = (): void => {
    if (showChildren) {
      hideLayerChildren({id: layer});
    } else {
      showLayerChildren({id: layer});
    }
  }

  return (
    <div
      className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
      onClick={isGroup && !isDragGhost ? handleChevronClick : null}
      style={{
        pointerEvents: isGroup ? 'auto' : 'none'
      }}>
      {
        isGroup
        ? <Icon
            name={showChildren ? 'thicc-chevron-down' : 'thicc-chevron-right'}
            small
            style={{
              fill: isSelected
              ? theme.text.onPrimary
              : theme.text.lighter
            }} />
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerChevronProps): {
  showChildren: boolean;
  isGroup: boolean;
  isSelected: boolean;
} => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const isGroup = layerItem.type === 'Group' || layerItem.type === 'Artboard';
  const showChildren = (isGroup ? (layerItem as em.Group).showChildren : false) && !ownProps.isDragGhost;
  const isSelected = layerItem.selected && !ownProps.isDragGhost;
  return { showChildren, isGroup, isSelected };
};

export default connect(
  mapStateToProps,
  { showLayerChildren, hideLayerChildren }
)(SidebarLayerChevron);