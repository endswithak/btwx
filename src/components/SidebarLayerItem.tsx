import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';
import TreeNode from '../canvas/base/treeNode';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerShape from './SidebarLayerShape';
import SidebarLayerFolder from './SidebarLayerFolder';

interface SidebarLayerItemProps {
  layer: TreeNode;
  depth: number;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const globalState = useContext(store);
  const { dispatch, theme, dragLayer } = globalState;
  const { layer, depth } = props;

  return (
    <div
      className='c-layers-sidebar__layer-item'
      style={{
        paddingLeft: depth * (theme.unit * 6)
      }}>
      <SidebarLayerChevron
        layer={layer} />
      <SidebarLayerFolder
        layer={layer} />
      <SidebarLayerShape
        layer={layer} />
      <SidebarLayerTitle
        layer={layer} />
    </div>
  );
}

export default SidebarLayerItem;