import React, { ReactElement, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
import { SetDragOverPayload } from '../store/actionTypes/leftSidebar';
import { setDragging, setEditing, setDragOver } from '../store/actions/leftSidebar';
import { setLayerHover, selectLayers, deselectLayers, setHoverFillThunk, setHoverStrokeThunk, setHoverShadowThunk } from '../store/actions/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import SidebarLayerDropzoneWrap from './SidebarLayerDropzoneWrap';
import SidebarLayerTitle from './SidebarLayerTitle';
import SidebarLayerChevron from './SidebarLayerChevron';
import SidebarLayerIcon from './SidebarLayerIcon';
import SidebarLayerMaskedIcon from './SidebarLayerMaskedIcon';
import SidebarLayerActiveArtboardIndicator from './SidebarLayerActiveArtboardIndicator';
import SidebarLayerGroupEventTweensButton from './SidebarLayerGroupEventTweensButton';
import SidebarLayerBoolButton from './SidebarLayerBoolButton';
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
  const draggingFill = useSelector((state: RootState) => state.rightSidebar.draggingFill);
  const draggingStroke = useSelector((state: RootState) => state.rightSidebar.draggingStroke);
  const draggingShadow = useSelector((state: RootState) => state.rightSidebar.draggingShadow);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].selected : null);
  const isEditing = useSelector((state: RootState) => state.leftSidebar.editing === id);
  const isShape = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type === 'Shape' : false);
  const isCompoundShape = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type === 'CompoundShape' : false);
  const isArtboard = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type === 'Artboard' : false);
  const isGroup = useSelector((state: RootState) => state.layer.present.byId[id] ? state.layer.present.byId[id].type === 'Group' : false);
  const isHover = useSelector((state: RootState) => id === state.layer.present.hover);
  const groupedEventTweens = useSelector((state: RootState) => isGroup && (state.layer.present.byId[id] as Btwx.Group).groupEventTweens);
  const hasChildren = useSelector((state: RootState) => (isArtboard || isGroup || isCompoundShape) && (state.layer.present.byId[id] as Btwx.Artboard | Btwx.Group | Btwx.CompoundShape).children.length > 0);
  const parentCompoundShape = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[state.layer.present.byId[id].parent] && state.layer.present.byId[state.layer.present.byId[id].parent].type === 'CompoundShape');
  const hasSiblings = useSelector((state: RootState) => parentCompoundShape && (state.layer.present.byId[state.layer.present.byId[id].parent] as Btwx.CompoundShape).children.length > 1);
  const oldestSibling = useSelector((state: RootState) => hasSiblings && (state.layer.present.byId[state.layer.present.byId[id].parent] as Btwx.CompoundShape).children[0] === id);
  const canBool = parentCompoundShape && hasSiblings && !oldestSibling
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

  const handleDragOver = (e: any): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isHover) {
      dispatch(setLayerHover({
        id: id
      }));
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggingFill) {
      dispatch(setHoverFillThunk());
    } else if (draggingStroke) {
      dispatch(setHoverStrokeThunk());
    } else if (draggingShadow) {
      dispatch(setHoverShadowThunk());
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
      onDragOver={dragging ? null : handleDragOver}
      onDrop={dragging ? null : handleDrop}
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
      {/* {
        isArtboard
        ? <SidebarLayerActiveArtboardIndicator
            id={id}
            isDragGhost={isDragGhost} />
        : null
      } */}
      {
        canBool
        ? <SidebarLayerBoolButton
            id={id}
            isDragGhost={isDragGhost} />
        : null
      }
      {
        isGroup
        ? <SidebarLayerGroupEventTweensButton
            id={id}
            isDragGhost={isDragGhost} />
        : null
      }
      {
        draggable
        ? <SidebarLayerDropzoneWrap
            layer={id}
            isDragGhost={isDragGhost} />
        : null
      }
    </ListItem>
  );
}

export default SidebarLayer;