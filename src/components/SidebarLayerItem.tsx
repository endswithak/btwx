import React, { useContext, ReactElement, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerShape from './SidebarLayerShape';
import SidebarLayerFolder from './SidebarLayerFolder';

interface SidebarLayerItemProps {
  layer: em.Layer;
  depth: number;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, depth } = props;

  return (
    <div
      className='c-layers-sidebar__layer-item'
      style={{
        background: layer.selected
        ? theme.palette.primary
        : 'none',
        paddingLeft: depth * (theme.unit * 6)
      }}>
      <SidebarLayerChevron
        layer={layer} />
      <SidebarLayerFolder
        layer={layer} />
      {/* <SidebarLayerShape
        layer={layer} /> */}
      <SidebarLayerTitle
        layer={layer} />
    </div>
  );
}

export default SidebarLayerItem;