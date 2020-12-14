import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarLayerDropzone from './SidebarLayerDropzone';

interface SidebarLayerDropzoneWrapProps {
  layer: string;
  isDragGhost?: boolean;
}

const SidebarLayerDropzoneWrap = (props: SidebarLayerDropzoneWrapProps): ReactElement => {
  const { layer, isDragGhost } = props;
  const isParent = useSelector((state: RootState) => state.leftSidebar.dragOver ? state.layer.present.byId[state.leftSidebar.dragOver] && layer === state.layer.present.byId[state.leftSidebar.dragOver].parent : null);
  const isEnabled = useSelector((state: RootState) => (state.leftSidebar.dragOver === layer || isParent) && state.leftSidebar.dragOver !== state.leftSidebar.dragging && !isDragGhost);

  return (
    isEnabled
    ? <SidebarLayerDropzone
        layer={layer}
        isParent={isParent} />
    : null
  );
}

export default SidebarLayerDropzoneWrap;