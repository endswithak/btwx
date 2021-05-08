import React, { ReactElement, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
import { SetDragOverPayload } from '../store/actionTypes/leftSidebar';
import { setDragging, setEditing, setDragOver } from '../store/actions/leftSidebar';
import { setLayerHover, selectLayers, deselectLayers } from '../store/actions/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import SidebarLayerDropzoneWrap from './SidebarLayerDropzoneWrap';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';
import ListItem from './ListItem';

interface SidebarLayerProps {
  id: string;
  isOpen?: boolean;
  setOpen?: any;
  nestingLevel?: number;
  style?: any;
  isDragGhost?: boolean;
  draggable?: boolean;
  sticky?: boolean;
  searchTree?: boolean;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { id, searchTree, nestingLevel, isDragGhost, setOpen, isOpen, style, draggable, sticky } = props;
  const dragging = useSelector((state: RootState) => state.leftSidebar.dragging);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].selected : null);
  const isEditing = useSelector((state: RootState) => state.leftSidebar.editing === id);
  const isArtboard = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type === 'Artboard' && !isDragGhost : false);
  const isActiveArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard === id);
  const isHover = useSelector((state: RootState) => id === state.layer.present.hover);
  const hasChildren = useSelector((state: RootState) => sticky && isArtboard ? state.layer.present.byId[id] ? state.layer.present.byId[id].children.length > 0 : null : null);
  // const hover = useSelector((state: RootState) => state.layer.present.hover);
  // const underlyingMask = useSelector((state: RootState) => state.layer.present.byId[id].type !== 'Artboard' ? (state.layer.present.byId[id] as Btwx.MaskableLayer).underlyingMask : null);
  const editing = useSelector((state: RootState) => state.leftSidebar.editing);
  const dispatch = useDispatch();

  const debounceDragOver = useCallback(
    debounce((payload: SetDragOverPayload) => {
      dispatch(setDragOver(payload));
    }, 20),
    []
  );

  const handleDragStart = (e: any): void => {
    dispatch(setDragging({
      dragging: id
    }));
    e.dataTransfer.setDragImage(document.getElementById('sidebar-drag-ghosts'), 0, 0);
  }

  const handleDragEnd = (e: any): void => {
    dispatch(setDragging({
      dragging: null
    }));
  }

  const handleDragEnter = (e: any) => {
    e.stopPropagation();
    if (dragging) {
      debounceDragOver({
        dragOver: id
      });
    }
  }

  const handleMouseDown = (e: any): void => {
    if (e.metaKey) {
      if (isSelected) {
        dispatch(deselectLayers({
          layers: [id]
        }));
      } else {
        dispatch(selectLayers({
          layers: [id]
        }));
      }
    } else {
      if (!isSelected) {
        dispatch(selectLayers({
          layers: [id],
          newSelection: true
        }));
      }
    }
    if (editing && !isEditing) {
      (document.getElementById(`control-${editing}-name`) as HTMLInputElement).blur();
    }
  }

  const handleMouseEnter = (e: any): void => {
    dispatch(setLayerHover({
      id: id
    }));
  }

  const handleMouseLeave = (): void => {
    dispatch(setLayerHover({
      id: null
    }));
  }

  const handleContextMenu = (e: any): void => {
    dispatch(openContextMenu({
      type: 'layer',
      id
    }));
  }

  const handleDoubleClick = (e: any): void => {
    const openIcon = document.getElementById(searchTree ? `search-tree-${id}-open-icon` : `${id}-open-icon`);
    if (e.target !== openIcon && !openIcon.contains(e.target)) {
      dispatch(setEditing({
        editing: id
      }));
    }
  }

  return (
    <ListItem
      as='div'
      id={
        isDragGhost
        ? `drag-ghost-${id}`
        : searchTree
        ? `search-tree-${id}`
        : id
      }
      // removes sticky bottom border when closed or open w/ no children
      // to avoid overlapped borders
      classNames={
        sticky
        ? isOpen && hasChildren
        ? ''
        : 'c-list-item--sticky'
        : ''
      }
      flush={isArtboard && !isDragGhost}
      interactive
      hovering={isHover && !isDragGhost}
      root={isArtboard && !isDragGhost}
      draggable={!isDragGhost && draggable}
      onMouseEnter={isDragGhost ? null : handleMouseEnter}
      onMouseLeave={isDragGhost ? null : handleMouseLeave}
      onMouseDown={isDragGhost ? null : handleMouseDown}
      onContextMenu={isDragGhost ? null : handleContextMenu}
      onDoubleClick={isDragGhost ? null : handleDoubleClick}
      onDragStart={isDragGhost ? null : handleDragStart}
      onDragEnd={isDragGhost ? null : handleDragEnd}
      onDragEnter={handleDragEnter}
      isActive={(isSelected || isEditing) && !isDragGhost}
      style={{
        ...style,
        paddingLeft: !isDragGhost ? nestingLevel * 12 : 0,
        paddingRight: 0
      }}>
      <SidebarLayerChevron
        id={id}
        isOpen={isOpen}
        setOpen={setOpen}
        isDragGhost={isDragGhost}
        searchTree={searchTree} />
      <SidebarLayerMaskedIcon
        id={id}
        isDragGhost={isDragGhost} />
      <SidebarLayerIcon
        id={id}
        isDragGhost={isDragGhost} />
      <SidebarLayerTitle
        id={id}
        isDragGhost={isDragGhost} />
      {
        draggable
        ? <SidebarLayerDropzoneWrap
            layer={id}
            isDragGhost={isDragGhost} />
        : null
      }
      {
        isActiveArtboard && !isDragGhost
        ? <ListItem.Right>
            <div
              className={`c-sidebar-layer__icon c-sidebar-layer__icon--aa${
                isSelected
                ? `${' '}c-sidebar-layer__icon--aa-selected`
                : ''
              }`} />
          </ListItem.Right>
        : null
      }
    </ListItem>
  );
}

export default SidebarLayer;