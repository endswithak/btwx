/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useContext, useState, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { insertLayersAbove, insertLayersBelow, addLayerChildren } from '../store/actions/layer';
import { getSelectedById } from '../store/selectors/layer';
import { setDragging } from '../store/actions/leftSidebar';
import { isBetween } from '../utils';
import { ThemeContext } from './ThemeProvider';

interface SidebarLayerDropzoneProps {
  layer: string;
  isParent: boolean;
}

const SidebarLayerDropzone = (props: SidebarLayerDropzoneProps): ReactElement => {
  const { layer, isParent } = props;
  const theme = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[layer]);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [dropzone, setDropzone] = useState(null);
  const [canDrop, setCanDrop] = useState(false);
  const dispatch = useDispatch();

  const getDropzone = (e: any) => {
    const padding = 8;
    const y = e.clientY;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.top + (rect.height / 2);
    const aboveCenter = y < center;
    switch(layerItem.type) {
      case 'Artboard':
      case 'Group': {
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

  const canDropCenter = () => {
    const something1 = selected.some(id => document.getElementById(id).contains(ref.current));
    const something2 = selected.some(id => selectedById[id].type === 'Artboard') && (layerItem.type === 'Artboard' || layerItem.type === 'Group');
    return !something1 && !something2;
  }

  const canDropTopBottom = () => {
    const something1 = selected.some(id => document.getElementById(id).contains(ref.current));
    const something2 = selected.some(id => selectedById[id].type === 'Artboard') && layerItem.parent !== 'root';
    const something3 = selected.some(id => selectedById[id].type !== 'Artboard') && layerItem.type === 'Artboard';
    return !something1 && !something2 && !something3;
  }

  const getCanDrop = (dropzone: Btwx.Dropzone) => {
    switch(dropzone) {
      case 'top':
      case 'bottom':
        return canDropTopBottom();
      case 'center':
        return canDropCenter();
    }
  }

  const handleDragOver = (e: any) => {
    e.preventDefault();
    const newDropzone = getDropzone(e);
    const newCanDrop = getCanDrop(newDropzone);
    if (newDropzone !== dropzone) {
      setDropzone(newDropzone);
    }
    if (newCanDrop !== canDrop) {
      setCanDrop(newCanDrop);
    }
  }

  const handleDrop = (e: any) => {
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
      dispatch(setDragging({dragging: null}));
    }
  }

  return (
    <div
      ref={ref}
      className='c-sidebar-dropzone'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        boxShadow: canDrop && !isParent
        ? (() => {
            switch(dropzone) {
              case 'top':
                return `0 ${theme.unit / 2}px 0 0 ${theme.palette.primary} inset`;
              case 'center':
                return `0 0 0 ${theme.unit / 2}px ${theme.palette.primary} inset`;
              case 'bottom':
                return `0 ${theme.unit / 2}px 0 0 ${theme.palette.primary}`;
            }
          })()
        : isParent
          ? `0 0 0 ${theme.unit / 2}px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
          : null,
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
          ? <div
              className={`c-sidebar-dropzone__tbi c-sidebar-dropzone__tbi--${dropzone}`}
              style={{
                background: theme.palette.primary
              }} />
          : null
        }
      </div>
  );
}

export default SidebarLayerDropzone;