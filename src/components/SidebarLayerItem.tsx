import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerShape from './SidebarLayerShape';
import SidebarLayerFolder from './SidebarLayerFolder';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { RootState } from '../store/reducers';

interface SidebarLayerItemProps {
  layer: em.Layer;
  depth: number;
  hover?: string;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, depth, hover, setLayerHover } = props;

  const handleMouseEnter = () => {
    setLayerHover({id: layer.id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
  }

  return (
    <div
      className='c-layers-sidebar__layer-item'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: layer.selected
        ? theme.palette.primary
        : layer.type === 'Artboard'
          ? theme.background.z4
          : 'none',
        paddingLeft: depth * (theme.unit * 6),
        boxShadow: hover === layer.id ? `0 0 0 ${theme.unit / 2}px ${theme.background.z3} inset` : ''
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

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const hover = layer.present.hover;
  return { hover };
};

export default connect(
  mapStateToProps,
  { setLayerHover }
)(SidebarLayerItem);