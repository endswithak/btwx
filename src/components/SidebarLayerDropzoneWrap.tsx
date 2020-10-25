import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarLayerDropzone from './SidebarLayerDropzone';

interface SidebarLayerDropzoneWrapProps {
  layer: string;
  isDragGhost?: boolean;
  isEnabled?: boolean;
  isParent?: boolean;
}

const SidebarLayerDropzoneWrap = (props: SidebarLayerDropzoneWrapProps): ReactElement => {
  const { layer, isDragGhost, isEnabled, isParent } = props;

  return (
    isEnabled
    ? <SidebarLayerDropzone
        layer={layer}
        isParent={isParent} />
    : null
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerDropzoneWrapProps): {
  isEnabled: boolean;
  isParent?: boolean;
} => {
  const { leftSidebar, layer } = state;
  const dragOverItem = leftSidebar.dragOver ? layer.present.byId[leftSidebar.dragOver] : null;
  const isParent = dragOverItem && ownProps.layer === dragOverItem.parent;
  const isEnabled = (leftSidebar.dragOver === ownProps.layer || isParent) && leftSidebar.dragOver !== leftSidebar.dragging && !ownProps.isDragGhost;
  return { isEnabled, isParent };
};

export default connect(
  mapStateToProps
)(SidebarLayerDropzoneWrap);