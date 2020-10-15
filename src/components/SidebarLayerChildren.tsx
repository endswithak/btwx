import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerChildrenProps {
  layer: string;
  dragGhost?: boolean;
  hasChildren?: boolean;
  showChildren?: boolean;
  children?: string[];
}

const SidebarLayerChildren = (props: SidebarLayerChildrenProps): ReactElement => {
  const { layer, dragGhost, hasChildren, showChildren, children } = props;

  return (
    hasChildren && showChildren
    ? <SidebarLayers
        layers={children}
        dragGhost={dragGhost} />
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerChildrenProps) => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const selected = layer.present.selected;
  const hasChildren = layerItem.type === 'Group' || layerItem.type === 'Artboard';
  const showChildren = hasChildren && (layerItem as em.Group | em.Artboard).showChildren;
  const children = hasChildren ? [...(layerItem as em.Group | em.Artboard).children].reverse() : null;
  return { layerItem, selected, hasChildren, showChildren, children };
};

export default connect(
  mapStateToProps
)(SidebarLayerChildren);