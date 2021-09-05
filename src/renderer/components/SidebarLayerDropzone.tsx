/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useState, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { insertLayersAbove, insertLayersBelow, addLayerChildren } from '../store/actions/layer';
import { getSelectedById } from '../store/selectors/layer';
import { setDragging } from '../store/actions/leftSidebar';
import { isBetween } from '../utils';

interface SidebarLayerDropzoneProps {
  layer: string;
  isParent: boolean;
}

const SidebarLayerDropzone = (props: SidebarLayerDropzoneProps): ReactElement => {
  const { layer, isParent } = props;
  const ref = useRef<HTMLDivElement>(null);
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[layer]);
  const parentItem = useSelector((state: RootState) => layerItem && state.layer.present.byId[layerItem.parent]);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [dropzone, setDropzone] = useState(null);
  const [canDrop, setCanDrop] = useState(false);
  const dispatch = useDispatch();

  const getDropzone = (e: any): Btwx.Dropzone => {
    const padding = 8;
    const y = e.clientY;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.top + (rect.height / 2);
    const aboveCenter = y < center;
    switch(layerItem.type) {
      case 'Artboard':
      case 'Group':
      case 'CompoundShape': {
        if (isBetween(y, rect.top, rect.top + padding)) {
          return 'top';
        } else if (isBetween(y, rect.bottom - padding, rect.bottom)) {
          return 'bottom';
        } else {
          return 'center';
        }
      }
      case 'Image':
      case 'Shape':
      case 'Text': {
        return aboveCenter ? 'top' : 'bottom';
      }
    }
  }

  const canDropCenter = (): boolean => {
    const droppingInSelf = selected.some(id => {
      const selectedItem = document.getElementById(id);
      return selectedItem && selectedItem.contains(ref.current);
    });
    const onlyShapeItemsSelected = selected.every(id => selectedById[id].type === 'Shape' || selectedById[id].type === 'CompoundShape');
    const noArtboardsSelected = selected.every(id => selectedById[id].type !== 'Artboard');
    const onlyArtboardsSelected = selected.every(id => selectedById[id].type === 'Artboard');
    switch(layerItem.type) {
      case 'Root':
        return onlyArtboardsSelected;
      case 'Artboard':
      case 'Group':
        return !droppingInSelf && noArtboardsSelected;
      case 'CompoundShape':
        return !droppingInSelf && onlyShapeItemsSelected;
    }
  }

  const canDropTopBottom = (): boolean => {
    const droppingInSelf = selected.some(id => {
      const selectedItem = document.getElementById(id);
      return selectedItem && selectedItem.contains(ref.current);
    });
    const onlyShapeItemsSelected = selected.every(id => selectedById[id].type === 'Shape' || selectedById[id].type === 'CompoundShape');
    const noArtboardsSelected = selected.every(id => selectedById[id].type !== 'Artboard');
    const onlyArtboardsSelected = selected.every(id => selectedById[id].type === 'Artboard');
    switch(layerItem.type) {
      case 'Artboard':
        return !droppingInSelf && onlyArtboardsSelected;
      case 'Group':
      case 'Image':
      case 'Text':
        return !droppingInSelf && noArtboardsSelected;
      case 'Shape':
      case 'CompoundShape':
        switch(parentItem.type) {
          case 'CompoundShape':
            return !droppingInSelf && onlyShapeItemsSelected;
          default:
            return !droppingInSelf && noArtboardsSelected;
        }
    }
  }

  const getCanDrop = (dropzone: Btwx.Dropzone): boolean => {
    switch(dropzone) {
      case 'top':
      case 'bottom':
        return canDropTopBottom();
      case 'center':
        return canDropCenter();
    }
  }

  const handleDragOver = (e: any): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const newDropzone = getDropzone(e);
    const newCanDrop = getCanDrop(newDropzone);
    if (newDropzone !== dropzone) {
      setDropzone(newDropzone);
    }
    if (newCanDrop !== canDrop) {
      setCanDrop(newCanDrop);
    }
  }

  const handleDrop = (e: any): void => {
    e.preventDefault();
    if (canDrop) {
      switch(dropzone) {
        case 'top': {
          dispatch(insertLayersAbove({
            layers: selected,
            above: layer
          }));
          break;
        }
        case 'center':
          dispatch(addLayerChildren({
            id: layer,
            children: selected
          }));
          break;
        case 'bottom':
          dispatch(insertLayersBelow({
            layers: selected,
            below: layer
          }));
          break;
      }
      dispatch(setDragging({
        dragging: null
      }));
    }
  }

  return (
    <div
      ref={ref}
      className={`c-sidebar-dropzone${
        canDrop && !isParent
        ? `${' '}c-sidebar-dropzone--${dropzone}`
        : ''
      }${
        isParent
        ? `${' '}c-sidebar-dropzone--parent`
        : ''
      }${
        layerItem.type === 'Artboard'
        ? `${' '}c-sidebar-dropzone--artboard`
        : ''
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        marginLeft: (dropzone === 'top' || dropzone === 'bottom') && !isParent
        ? document.getElementById(`${layer}-icon`)
          ? document.getElementById(`${layer}-mask-icon`)
            ? document.getElementById(`${layer}-mask-icon`).getBoundingClientRect().x
            : document.getElementById(`${layer}-icon`).getBoundingClientRect().x
          : 0
        : 0
      }}>
        {
          canDrop && (dropzone === 'top' || dropzone === 'bottom') && !isParent
          ? <div className={`c-sidebar-dropzone__tbi c-sidebar-dropzone__tbi--${dropzone}`} />
          : null
        }
      </div>
  );
}

export default SidebarLayerDropzone;