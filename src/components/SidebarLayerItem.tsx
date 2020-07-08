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
import styled from 'styled-components';

interface SidebarLayerItemProps {
  layer: em.Layer;
  depth: number;
  hover?: string;
  setDraggable?(draggable: boolean): void;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
}

const Background = styled.div`
  background: ${
    props => props.isSelected || props.isEditing
    ? props.theme.palette.primary
    : props.isArtboard
      ? props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0
      : 'none'
  };
  box-shadow: 0 0 0 1px ${
    props => props.isHovering
    ? props.isSelected
      ? props.theme.palette.primaryHover
      : props.theme.palette.primary
    : props.isArtboard
      ? props.theme.name === 'dark'
        ? props.theme.background.z4
        : props.theme.background.z5
      : 'none'
  } inset;
`;

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
        paddingLeft: depth * (theme.unit * 6)
      }}>
      <Background
        isSelected={layer.selected}
        isEditing={editing}
        isArtboard={layer.type === 'Artboard'}
        isHovering={hover === layer.id}
        theme={theme}
        className='c-layers-sidebar-layer-item__background' />
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