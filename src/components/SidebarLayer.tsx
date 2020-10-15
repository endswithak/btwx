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
  // isSelected?: boolean;
  // dragging?: boolean;
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { layer, setDragging } = props;

  const handleDragStart = (e: any): void => {
    setDragging({dragging: true});
    e.dataTransfer.setDragImage(document.getElementById('sidebarDragGhosts'), 0, 0);
  }

  const handleDragEnd = (e: any): void => {
    setDragging({dragging: false});
  }

  useEffect(() => {
    console.log('LAYER');
  }, []);

  return (
    <div
      id={layer}
      draggable
      className='c-sidebar-layer'
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // style={{
      //   opacity: dragging && isSelected ? 0.5 : 1
      // }}
      >
      <SidebarLayerItem
        layer={layer} />
      <SidebarDropzone
        layer={layer} />
      <SidebarLayerChildren
        layer={layer} />
    </div>
  );
}

// const mapStateToProps = (state: RootState, ownProps: SidebarLayerProps) => {
//   const { layer, leftSidebar } = state;
//   const layerItem = layer.present.byId[ownProps.layer];
//   const isSelected = layerItem.selected;
//   const dragging = leftSidebar.dragging;
//   return { isSelected, dragging };
// };

export default connect(
  null,
  { setDragging }
)(SidebarLayer);