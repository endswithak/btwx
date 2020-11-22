import React, { ReactElement, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import debounce from 'lodash.debounce';
import { SetDraggingPayload, SetDragOverPayload, SetEditingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging, setEditing, setDragOver } from '../store/actions/leftSidebar';
import { setLayerHover, selectLayers, deselectLayers } from '../store/actions/layer';
import { SelectLayersPayload, DeselectLayersPayload, SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';
import SidebarLayerDropzoneWrap from './SidebarLayerDropzoneWrap';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerBackground from './SidebarLayerBackground';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';

interface SidebarLayerProps {
  id: string;
  isOpen?: boolean;
  setOpen?: any;
  nestingLevel?: number;
  style?: any;
  isDragGhost?: boolean;
  dragging?: string;
  isSelected?: boolean;
  isHover?: boolean;
  underlyingMask?: string;
  hover?: string;
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
  setDragOver?(payload: SetDragOverPayload): LeftSidebarTypes;
  setEditing?(payload: SetEditingPayload): LeftSidebarTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  deselectLayers?(payload: DeselectLayersPayload): LayerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { id, nestingLevel, setDragging, isDragGhost, dragging, hover, setDragOver, setOpen, isOpen, style, setLayerHover, openContextMenu, selectLayers, deselectLayers, setEditing, isSelected, isHover, underlyingMask } = props;

  const debounceDragOver = useCallback(
    debounce((payload: SetDragOverPayload) => {
      setDragOver(payload);
    }, 20),
    []
  );

  const handleDragStart = (e: any): void => {
    setDragging({dragging: id});
    e.dataTransfer.setDragImage(document.getElementById('sidebarDragGhosts'), 0, 0);
  }

  const handleDragEnd = (e: any): void => {
    setDragging({dragging: null});
  }

  const handleDragEnter = (e: any) => {
    e.stopPropagation();
    if (dragging) {
      debounceDragOver({dragOver: id});
    }
  }

  const handleMouseDown = (e: any): void => {
    if (e.metaKey) {
      if (isSelected) {
        deselectLayers({layers: [id]});
      } else {
        selectLayers({layers: [id]});
      }
    } else {
      if (!isSelected) {
        selectLayers({layers: [id], newSelection: true});
      }
    }
  }

  const handleMouseEnter = (e: any): void => {
    setLayerHover({id: id});
  }

  const handleMouseLeave = (): void => {
    setLayerHover({id: null});
  }

  const handleContextMenu = (e: any) => {
    openContextMenu({
      type: 'LayerEdit',
      id: id,
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
    const openIcon = document.getElementById(`${id}-open-icon`);
    if (e.target !== openIcon && !openIcon.contains(e.target)) {
      setEditing({editing: id, edit: name});
    }
  }

  useEffect(() => {
    console.log('LAYER');
  }, []);

  return (
    <div
      id={isDragGhost ? `dragGhost-${id}` : id}
      draggable={!isDragGhost}
      className='c-sidebar-layer'
      style={{
        ...style,
        paddingLeft: !isDragGhost ? nestingLevel * 12 : 0
      }}
      onMouseEnter={isDragGhost ? null : handleMouseEnter}
      onMouseLeave={isDragGhost ? null : handleMouseLeave}
      onMouseDown={isDragGhost ? null : handleMouseDown}
      onContextMenu={isDragGhost ? null : handleContextMenu}
      onDoubleClick={isDragGhost ? null : handleDoubleClick}
      onDragStart={isDragGhost ? null : handleDragStart}
      onDragEnd={isDragGhost ? null : handleDragEnd}
      onDragEnter={handleDragEnter}>
      <SidebarLayerBackground
        id={id}
        isDragGhost={isDragGhost} />
      <SidebarLayerChevron
        id={id}
        isOpen={isOpen}
        setOpen={setOpen}
        isDragGhost={isDragGhost} />
      <SidebarLayerMaskedIcon
        id={id}
        isDragGhost={isDragGhost} />
      <SidebarLayerIcon
        id={id}
        isDragGhost={isDragGhost} />
      <SidebarLayerTitle
        id={id}
        isDragGhost={isDragGhost} />
      <SidebarLayerDropzoneWrap
        layer={id}
        isDragGhost={isDragGhost} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerProps): {
  dragging: string;
  isSelected: boolean;
  isHover: boolean;
  underlyingMask: string;
  hover: string;
  editing: boolean;
} => {
  const { leftSidebar, layer } = state;
  const layerItem = layer.present.byId[ownProps.id];
  const dragging = leftSidebar.dragging;
  const isSelected = layerItem.selected;
  const isHover = layerItem.hover;
  const hover = layer.present.hover;
  const underlyingMask = layerItem.underlyingMask;
  const editing = ownProps.id === leftSidebar.editing;
  return { dragging, isSelected, isHover, underlyingMask, hover, editing };
};

export default connect(
  mapStateToProps,
  { setDragging, setDragOver, setLayerHover, openContextMenu, selectLayers, deselectLayers, setEditing }
)(SidebarLayer);