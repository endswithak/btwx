import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerTitleInput from './SidebarLayerTitleInput';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerShape from './SidebarLayerShape';
import SidebarLayerFolder from './SidebarLayerFolder';
import { setLayerHover, deselectAllLayers } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { RootState } from '../store/reducers';

interface SidebarLayerItemProps {
  layer: em.Layer;
  depth: number;
  hover?: string;
  setDraggable?(draggable: boolean): void;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  deselectAllLayers?(): LayerTypes;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const [editing, setEditing] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, depth, hover, setLayerHover, setDraggable, deselectAllLayers } = props;

  const handleMouseEnter = () => {
    setLayerHover({id: layer.id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
  }

  const handleDoubleClick = () => {
    deselectAllLayers();
    setEditing(true);
  }

  return (
    <div
      className='c-layers-sidebar__layer-item'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      style={{
        background: layer.selected || editing
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
      <SidebarLayerShape
        layer={layer} />
      {
        editing
        ? <SidebarLayerTitleInput
            layer={layer}
            setDraggable={setDraggable}
            setEditing={setEditing} />
        : <SidebarLayerTitle layer={layer} />
      }
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
  { setLayerHover, deselectAllLayers }
)(SidebarLayerItem);