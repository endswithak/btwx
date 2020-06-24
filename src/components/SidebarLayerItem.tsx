import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitleInput from './SidebarLayerTitleInput';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';
import { setLayerHover, selectLayer, deselectLayer } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayerPayload, DeselectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import { RootState } from '../store/reducers';

interface SidebarLayerItemProps {
  layer: em.Layer;
  depth: number;
  hover?: string;
  setDraggable?(draggable: boolean): void;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const [editing, setEditing] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, depth, hover, setLayerHover, setDraggable, selectLayer, deselectLayer } = props;

  const handleMouseEnter = () => {
    setLayerHover({id: layer.id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
  }

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey) {
      if (layer.selected) {
        deselectLayer({id: layer.id});
      } else {
        selectLayer({id: layer.id});
      }
    } else {
      selectLayer({id: layer.id, newSelection: true});
    }
  }

  return (
    <div
      className='c-layers-sidebar__layer-item'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        background: layer.selected || editing
        ? theme.palette.primary
        : layer.type === 'Artboard'
          ? theme.background.z3
          : 'none',
        paddingLeft: depth * (theme.unit * 6),
        boxShadow: hover === layer.id ? `0 0 0 ${theme.unit / 2}px ${theme.background.z3} inset` : ''
      }}>
      <SidebarLayerChevron
        layer={layer} />
      <SidebarLayerMaskedIcon
        layer={layer} />
      <SidebarLayerIcon
        layer={layer} />
      <SidebarLayerTitleInput
        layer={layer}
        setDraggable={setDraggable}
        editing={editing}
        setEditing={setEditing} />
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
  { setLayerHover, selectLayer, deselectLayer }
)(SidebarLayerItem);