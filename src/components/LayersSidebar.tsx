import React, { useContext, ReactElement, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarSectionWrap from './SidebarSectionWrap';
import SortableTree from './SortableTree';
import SidebarLayer from './SidebarLayer';
import SidebarLayerTree from './SidebarLayerTree';
import { LayerState } from '../store/reducers/layer';

interface LayersSidebarStateProps {
  page: string;
}

const LayersSidebar = (props: LayersSidebarStateProps): ReactElement => {
  return (
    <Sidebar
      width={320}
      position={'left'}
      >
      <SidebarSectionWrap>
        <SidebarSectionHead
          text={'layers'} />
      </SidebarSectionWrap>
      {
        props.page
        ? <SidebarLayerTree />
        : null
      }
    </Sidebar>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  return { page: layer.present.page };
};

export default connect(mapStateToProps)(LayersSidebar);

// let lsDeltaX = 0;

// const handleDragStart = (e) => {
//   lsDeltaX = e.clientX;
// }

// const handleDrag = (e) => {
//   if (e.clientX !== 0) {
//     dispatch({
//       type: 'set-layers-sidebar-width',
//       layersSidebarWidth: layersSidebarWidth + (e.clientX - lsDeltaX)
//     });
//     lsDeltaX = e.clientX;
//   }
// }