import React, { useContext, ReactElement, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetEditingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setEditing } from '../store/actions/leftSidebar';
import { setLayerHover, selectLayers, deselectLayers } from '../store/actions/layer';
import { SelectLayersPayload, DeselectLayersPayload, SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { ThemeContext } from './ThemeProvider';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerBackground from './SidebarLayerBackground';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';

interface SidebarLayerItemProps {
  layer: string;
  depth?: number;
  isSelected?: boolean;
  isDragGhost?: boolean;
  // editing?: boolean;
  setEditing?(payload: SetEditingPayload): LeftSidebarTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  deselectLayers?(payload: DeselectLayersPayload): LayerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

const SidebarLayerItem = memo(function SidebarLayerItem(props: SidebarLayerItemProps) {
  const theme = useContext(ThemeContext);
  const { layer, isSelected, depth, setLayerHover, openContextMenu, selectLayers, deselectLayers, setEditing, isDragGhost } = props;

  const handleMouseDown = (e: any): void => {
    // if (!editing) {
    // }
    if (e.metaKey) {
      if (isSelected) {
        deselectLayers({layers: [layer]});
      } else {
        selectLayers({layers: [layer]});
      }
    } else {
      if (!isSelected) {
        selectLayers({layers: [layer], newSelection: true});
      }
    }
  }

  const handleMouseEnter = (): void => {
    setLayerHover({id: layer});
  }

  const handleMouseLeave = (): void => {
    setLayerHover({id: null});
  }

  const handleContextMenu = (e: any) => {
    // if (!editing) {
    // }
    openContextMenu({
      type: 'LayerEdit',
      id: layer,
      x: e.clientX,
      y: e.clientY,
      paperX: e.clientX,
      paperY: e.clientY,
      data: {
        origin: 'sidebar'
      }
    });
  }

  const handleDoubleClick = (e: any): void => {
    const layerExpand = document.getElementById(`${layer}-expand`);
    if (e.target !== layerExpand && !layerExpand.contains(e.target)) {
      setEditing({editing: layer});
    }
  }

  useEffect(() => {
    console.log('LAYER ITEM');
  }, []);

  return (
    <div
      className='c-layers-sidebar__layer-item'
      style={{
        paddingLeft: depth * (theme.unit * 3)
      }}
      onMouseDown={isDragGhost ? null : handleMouseDown}
      onMouseEnter={isDragGhost ? null : handleMouseEnter}
      onMouseLeave={isDragGhost ? null : handleMouseLeave}
      onContextMenu={isDragGhost ? null : handleContextMenu}
      onDoubleClick={isDragGhost ? null : handleDoubleClick}>
      <SidebarLayerBackground
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarLayerChevron
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarLayerMaskedIcon
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarLayerIcon
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarLayerTitle
        layer={layer}
        isDragGhost={isDragGhost} />
    </div>
  );
});

const mapStateToProps = (state: RootState, ownProps: SidebarLayerItemProps) => {
  const { layer, leftSidebar } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const isSelected = layerItem.selected;
  // const editing = leftSidebar.editing === ownProps.layer;
  const depth = layerItem.scope.length - 1;
  return { isSelected, depth };
};

export default connect(
  mapStateToProps,
  { setLayerHover, openContextMenu, selectLayers, deselectLayers, setEditing }
)(SidebarLayerItem);