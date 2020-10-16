import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarDropzoneTop from './SidebarDropzoneTop';
import SidebarDropzoneCenter from './SidebarDropzoneCenter';
import SidebarDropzoneBottom from './SidebarDropzoneBottom';

interface SidebarLayerDropzoneProps {
  layer: string;
  isDragGhost?: boolean;
  dragging?: boolean;
}

const SidebarLayerDropzone = (props: SidebarLayerDropzoneProps): ReactElement => {
  const { dragging, isDragGhost } = props;

  return (
    dragging && !isDragGhost
    ? <div className='c-sidebar-dropzone'>
        <SidebarDropzoneCenter
          {...props} />
        <SidebarDropzoneTop
          {...props}/>
        <SidebarDropzoneBottom
          {...props} />
      </div>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { leftSidebar } = state;
  const dragging = leftSidebar.dragging;
  return { dragging };
};

export default connect(
  mapStateToProps
)(SidebarLayerDropzone);