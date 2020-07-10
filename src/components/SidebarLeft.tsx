import React, { ReactElement } from 'react';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';

const SidebarLeft = (): ReactElement => {
  return (
    <Sidebar
      width={320}
      position={'left'}>
      <SidebarLayerTree />
    </Sidebar>
  );
}

export default SidebarLeft;