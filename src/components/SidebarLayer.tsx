import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetDraggingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging } from '../store/actions/leftSidebar';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayerChildren from './SidebarLayerChildren';

interface SidebarLayerProps {
  layer: string;
  isSelected?: boolean;
  isDropzone?: boolean;
  dragging?: boolean;
  dragGhost?: boolean;
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { layer, dragGhost, isDropzone, isSelected, dragging, setDragging } = props;

  const handleDragStart = (e: any): void => {
    setDragging({dragging: true});
    e.dataTransfer.setDragImage(document.getElementById('sidebarDragGhosts'), 0, 0);
  }

  const handleDragEnd = (e: any): void => {
    setDragging({dragging: false});
  }

  // useEffect(() => {
  //   console.log('LAYER');
  // }, [layer]);

  return (
    <div
      id={dragGhost ? `${layer}-dragGhost` : layer}
      draggable
      className='c-sidebar-layer'
      onDragStart={dragGhost ? null : handleDragStart}
      onDragEnd={dragGhost ? null : handleDragEnd}
      style={{
        opacity: dragging && isSelected ? 0.5 : 1
      }}>
      <SidebarLayerItem
        layer={layer}
        dragGhost={dragGhost} />
      {
        isDropzone
        ? <SidebarDropzone
            layer={layer} />
        : null
      }
      <SidebarLayerChildren
        layer={layer}
        dragGhost={dragGhost} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerProps) => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const isSelected = layerItem.selected;
  const isDropzone = leftSidebar.dragging && !ownProps.dragGhost;
  const dragging = leftSidebar.dragging;
  return { isSelected, dragging, isDropzone };
};

export default connect(
  mapStateToProps,
  { setDragging }
)(SidebarLayer);