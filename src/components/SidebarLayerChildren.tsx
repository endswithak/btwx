import React, { ReactElement, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { makeReversedChildren } from '../store/selectors';
import { RootState } from '../store/reducers';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerChildrenProps {
  layer: string;
  isDragGhost?: boolean;
  showChildren?: boolean;
  children?: string[];
}

const SidebarLayerChildren = memo(function SidebarLayerChildren(props: SidebarLayerChildrenProps) {
  const { layer, showChildren, children, isDragGhost } = props;

  useEffect(() => {
    console.log('LAYER CHILDREN');
  }, []);

  return (
    showChildren && !isDragGhost
    ? <SidebarLayers
        layers={children} />
    : null
  );
});

const makeMapStateToProps = () => {
  const getReversedChildren = makeReversedChildren()
  const mapStateToProps = (state: RootState, ownProps: SidebarLayerChildrenProps) => {
    const { layer } = state;
    const layerItem = layer.present.byId[ownProps.layer];
    const hasChildren = layerItem.type === 'Group' || layerItem.type === 'Artboard';
    const showChildren = hasChildren && (layerItem as em.Group | em.Artboard).showChildren;
    const children = getReversedChildren(state, ownProps);
    return {
      showChildren,
      children
    }
  }
  return mapStateToProps
};

export default connect(
  makeMapStateToProps
)(SidebarLayerChildren);