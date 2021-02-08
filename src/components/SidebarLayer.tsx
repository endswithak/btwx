import React, { ReactElement, useEffect, useCallback } from 'react';
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
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { id, nestingLevel, isDragGhost, setOpen, isOpen, style, draggable } = props;
  const dragging = useSelector((state: RootState) => state.leftSidebar.dragging);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id].selected);
  const isEditing = useSelector((state: RootState) => state.leftSidebar.editing === id);
  const isArtboard = useSelector((state: RootState) => state.layer.present.byId[id].type === 'Artboard' && !isDragGhost);
  const isHovering = useSelector((state: RootState) => state.layer.present.byId[id].hover && !isDragGhost);
  // const isHover = useSelector((state: RootState) => state.layer.present.byId[id].hover);
  // const hover = useSelector((state: RootState) => state.layer.present.hover);
  // const underlyingMask = useSelector((state: RootState) => state.layer.present.byId[id].type !== 'Artboard' ? (state.layer.present.byId[id] as Btwx.MaskableLayer).underlyingMask : null);
  // const editing = useSelector((state: RootState) => state.leftSidebar.editing === id);
  const dispatch = useDispatch();

  const debounceDragOver = useCallback(
    debounce((payload: SetDragOverPayload) => {
      dispatch(setDragOver(payload));
    }, 20),
    []
  );

  const handleDragStart = (e: any): void => {
    dispatch(setDragging({dragging: id}));
    e.dataTransfer.setDragImage(document.getElementById('sidebarDragGhosts'), 0, 0);
  }

  const handleDragEnd = (e: any): void => {
    dispatch(setDragging({dragging: null}));
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
        dispatch(deselectLayers({layers: [id]}));
      } else {
        dispatch(selectLayers({layers: [id]}));
      }
    } else {
      if (!isSelected) {
        dispatch(selectLayers({layers: [id], newSelection: true}));
      }
    }
  }

  const handleMouseEnter = (e: any): void => {
    dispatch(setLayerHover({id: id}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setLayerHover({id: null}));
  }

  const handleContextMenu = (e: any): void => {
    dispatch(openContextMenu({
      type: 'LayerEdit',
      id: id,
      x: e.clientX,
      y: e.clientY,
      paperX: e.clientX,
      paperY: e.clientY,
      data: {
        origin: 'sidebar'
      }
    }));
  }

  const handleDoubleClick = (e: any): void => {
    const openIcon = document.getElementById(`${id}-open-icon`);
    if (e.target !== openIcon && !openIcon.contains(e.target)) {
      dispatch(setEditing({editing: id}));
    }
  }

  useEffect(() => {
    console.log(isDragGhost ? 'GHOST LAYER' : 'LAYER');
  }, []);

  return (
    <ListItem
      as='button'
      id={isDragGhost ? `dragGhost-${id}` : id}
      draggable={!isDragGhost && draggable}
      onMouseEnter={isDragGhost ? null : handleMouseEnter}
      onMouseLeave={isDragGhost ? null : handleMouseLeave}
      onMouseDown={isDragGhost ? null : handleMouseDown}
      onContextMenu={isDragGhost ? null : handleContextMenu}
      onDoubleClick={isDragGhost ? null : handleDoubleClick}
      onDragStart={isDragGhost ? null : handleDragStart}
      onDragEnd={isDragGhost ? null : handleDragEnd}
      onDragEnter={handleDragEnter}
      active={isSelected || isEditing}
      style={{
        ...style,
        paddingLeft: !isDragGhost ? nestingLevel * 12 : 0
      }}>
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
      {
        draggable
        ? <SidebarLayerDropzoneWrap
            layer={id}
            isDragGhost={isDragGhost} />
        : null
      }
    </ListItem>
    // <div
    //   id={isDragGhost ? `dragGhost-${id}` : id}
    //   draggable={!isDragGhost && draggable}
    //   className='c-sidebar-layer'
    //   style={{
    //     ...style,
    //     paddingLeft: !isDragGhost ? nestingLevel * 12 : 0
    //   }}
    //   onMouseEnter={isDragGhost ? null : handleMouseEnter}
    //   onMouseLeave={isDragGhost ? null : handleMouseLeave}
    //   onMouseDown={isDragGhost ? null : handleMouseDown}
    //   onContextMenu={isDragGhost ? null : handleContextMenu}
    //   onDoubleClick={isDragGhost ? null : handleDoubleClick}
    //   onDragStart={isDragGhost ? null : handleDragStart}
    //   onDragEnd={isDragGhost ? null : handleDragEnd}
    //   onDragEnter={handleDragEnter}>
    //   <SidebarLayerBackground
    //     id={id}
    //     isDragGhost={isDragGhost} />
    //   <SidebarLayerChevron
    //     id={id}
    //     isOpen={isOpen}
    //     setOpen={setOpen}
    //     isDragGhost={isDragGhost} />
    //   <SidebarLayerMaskedIcon
    //     id={id}
    //     isDragGhost={isDragGhost} />
    //   <SidebarLayerIcon
    //     id={id}
    //     isDragGhost={isDragGhost} />
    //   <SidebarLayerTitle
    //     id={id}
    //     isDragGhost={isDragGhost} />
    //   {
    //     draggable
    //     ? <SidebarLayerDropzoneWrap
    //         layer={id}
    //         isDragGhost={isDragGhost} />
    //     : null
    //   }
    // </div>
  );
}

export default SidebarLayer;