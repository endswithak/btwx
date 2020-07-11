import React, { ReactElement, useState, useRef } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarLayer from './SidebarLayer';
import { orderLayersByDepth } from '../store/selectors/layer';

interface SidebarLayerDragGhostsProps {
  dragLayers: string[];
  dragging: boolean;
  orderedLayers?: string[];
}

const SidebarLayerDragGhosts = (props: SidebarLayerDragGhostsProps): ReactElement => {
  const { dragLayers, orderedLayers, dragging } = props;

  return (
    <div
      id='sidebarDragGhosts'
      style={{
        position: 'fixed',
        width: '100%',
        left: 999999999999
      }}>
      {
        orderedLayers.map((id, index) => (
          <SidebarLayer
            dragGhost
            key={index}
            layer={id}
            dragLayers={dragLayers}
            setDragLayers={() => {return;}}
            dragging={dragging}
            setDragging={() => {return;}}
            depth={0} />
        ))
      }
    </div>
  )
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerDragGhostsProps) => {
  const { layer } = state;
  const orderedLayers = orderLayersByDepth(layer.present, ownProps.dragLayers);
  return {
    orderedLayers
  };
};

export default connect(
  mapStateToProps
)(SidebarLayerDragGhosts);