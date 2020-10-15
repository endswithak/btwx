import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { showLayerChildren, hideLayerChildren } from '../store/actions/layer';
import { ShowLayerChildrenPayload, HideLayerChildrenPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface SidebarLayerChevronProps {
  layer: string;
  dragGhost: boolean;
  showChildren?: boolean;
  isGroup?: boolean;
  isSelected?: boolean;
  showLayerChildren?(payload: ShowLayerChildrenPayload): LayerTypes;
  hideLayerChildren?(payload: HideLayerChildrenPayload): LayerTypes;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { showChildren, isGroup, isSelected, layer, showLayerChildren, hideLayerChildren, dragGhost } = props;

  const handleChevronClick = (): void => {
    if (showChildren) {
      hideLayerChildren({id: layer});
    } else {
      showLayerChildren({id: layer});
    }
  }

  return (
    isGroup
    ? <div
        className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
        onClick={handleChevronClick}
        >
        <Icon
          name={showChildren ? 'thicc-chevron-down' : 'thicc-chevron-right'}
          small
          style={{
            fill: isSelected && !dragGhost
            ? theme.text.onPrimary
            : theme.text.lighter
          }} />
      </div>
    : <div
        className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
        style={{
          pointerEvents: 'none'
        }} />
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
  const showChildren = isGroup ? (layerItem as em.Group).showChildren : false;
  const isSelected = layerItem.selected;
  return { showChildren, isGroup, isSelected };
};

export default connect(
  mapStateToProps,
  { showLayerChildren, hideLayerChildren }
)(SidebarLayerChevron);