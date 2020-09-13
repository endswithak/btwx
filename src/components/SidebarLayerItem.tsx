import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';
import { setLayerHover, selectLayer, deselectLayer } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayerPayload, DeselectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import { RootState } from '../store/reducers';
import { getLayerScope } from '../store/selectors/layer';

interface SidebarLayerItemProps {
  layer: string;
  layerItem?: em.Layer;
  maskedParent?: boolean;
  depth: number;
  hover?: string;
  dragGhost?: boolean;
  setDraggable?(draggable: boolean): void;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
}

interface BackgroundProps {
  dragGhost: boolean;
  isSelected: boolean;
  isEditing: boolean;
  isArtboard: boolean;
  isHovering: boolean;
}

const Background = styled.div<BackgroundProps>`
  background: ${
    props => (props.isSelected || props.isEditing) && !props.dragGhost
    ? props.theme.palette.primary
    : props.isArtboard && !props.dragGhost
      ? props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0
      : 'none'
  };
  box-shadow: 0 0 0 1px ${
    props => (props.isSelected || props.isHovering) && !props.dragGhost
    ? props.theme.palette.primary
    : props.isArtboard && !props.dragGhost
      ? props.theme.name === 'dark'
        ? props.theme.background.z4
        : props.theme.background.z5
      : 'none'
  } inset;
`;

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const [editing, setEditing] = useState(false);
  const theme = useContext(ThemeContext);
  const { layer, layerItem, depth, hover, setLayerHover, setDraggable, selectLayer, deselectLayer, dragGhost, maskedParent } = props;

  const handleMouseEnter = () => {
    setLayerHover({id: layer});
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
        paddingLeft: depth * (theme.unit * 1.44)
      }}>
      <Background
        dragGhost={dragGhost}
        isSelected={layerItem.selected}
        isEditing={editing}
        isArtboard={layerItem.type === 'Artboard'}
        isHovering={hover === layer}
        theme={theme}
        className='c-layers-sidebar-layer-item__background' />
      <SidebarLayerChevron
        dragGhost={dragGhost}
        layer={layerItem} />
      <SidebarLayerMaskedIcon
        dragGhost={dragGhost}
        layer={layerItem}
        maskedParent={maskedParent} />
      <SidebarLayerIcon
        dragGhost={dragGhost}
        layer={layerItem} />
      <SidebarLayerTitle
        dragGhost={dragGhost}
        layer={layerItem}
        setDraggable={setDraggable}
        editing={editing}
        setEditing={setEditing} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerItemProps) => {
  const { layer } = state;
  const hover = layer.present.hover;
  const layerItem = layer.present.byId[ownProps.layer];
  const scope = getLayerScope(layer.present, ownProps.layer);
  const maskedParent = scope.some((id) => layer.present.byId[id].masked);
  return { hover, layerItem, maskedParent };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayer, deselectLayer }
)(SidebarLayerItem);