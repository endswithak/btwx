import React, { memo } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarDropzoneTop from './SidebarDropzoneTop';
import SidebarDropzoneCenter from './SidebarDropzoneCenter';
import SidebarDropzoneBottom from './SidebarDropzoneBottom';

interface SidebarLayerDropzoneProps {
  layer: string;
  isDragGhost?: boolean;
  isEnabled?: boolean;
}

const SidebarLayerDropzone = memo(function SidebarLayerDropzone(props: SidebarLayerDropzoneProps) {
  const { layer, isEnabled } = props;

  return (
    isEnabled
    ?  <div
          className='c-sidebar-dropzone'>
          <SidebarDropzoneCenter layer={layer} />
          <SidebarDropzoneTop layer={layer}/>
          <SidebarDropzoneBottom layer={layer} />
        </div>
    : null
  );
});

const mapStateToProps = (state: RootState, ownProps: SidebarLayerDropzoneProps) => {
  const { leftSidebar } = state;
  const isEnabled = leftSidebar.dragOver === ownProps.layer && leftSidebar.dragOver !== leftSidebar.dragging && !ownProps.isDragGhost;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(SidebarLayerDropzone);