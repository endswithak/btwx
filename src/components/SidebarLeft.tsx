import React, { useContext, ReactElement, useEffect } from 'react';
import Sidebar from './Sidebar';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarLayerTree from './SidebarLayerTree';

const SidebarLeft = (): ReactElement => {
  return (
    <Sidebar
      width={320}
      position={'left'}
      >
      <SidebarSectionWrap>
        <SidebarSectionHead
          text={'layers'} />
      </SidebarSectionWrap>
      <SidebarLayerTree />
    </Sidebar>
  );
}

export default SidebarLeft;