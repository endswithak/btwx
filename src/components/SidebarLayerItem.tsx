import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerShape from './SidebarLayerShape';
import SidebarLayerFolder from './SidebarLayerFolder';
import { setHover } from '../store/actions/hover';
import { hoverEnter, hoverLeave } from '../store/actions/layers';

interface SidebarLayerItemProps {
  layer: em.Layer;
  depth: number;
  setHover?: any;
  hoverEnter?: any;
  hoverLeave?: any;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, depth, setHover, hoverEnter, hoverLeave } = props;

  const handleMouseEnter = () => {
    setHover({id: layer.id});
    hoverEnter({id: layer.id});
  }

  const handleMouseLeave = () => {
    setHover({id: null});
    hoverLeave({id: layer.id});
  }

  return (
    <div
      className='c-layers-sidebar__layer-item'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: layer.selected
        ? theme.palette.primary
        : 'none',
        paddingLeft: depth * (theme.unit * 6),
        boxShadow: layer.hover ? `0 0 0 ${theme.unit / 2}px ${theme.background.z3} inset` : ''
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

export default connect(
  null,
  { setHover, hoverEnter, hoverLeave }
)(SidebarLayerItem);