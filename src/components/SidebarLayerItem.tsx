import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import PaperLayer from '../canvas/base/layer';
import PaperFill, { Fill } from '../canvas/base/style/fill';

interface SidebarLayerItemProps {
  layer: PaperLayer;
  path: string;
  depth: number;
  isGroup?: boolean;
  isOpen?: boolean;
  setIsOpen?: any;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const globalState = useContext(store);
  const { dispatch, selectedLayer, theme } = globalState;
  const { layer, path, depth, isGroup, isOpen, setIsOpen } = props;
  const isSelected = selectedLayer && layer.layer.id === selectedLayer.id;

  const handleNameClick = (): void => {
    dispatch({
      type: 'set-selected-layer',
      layer: layer,
      path: path
    });
  }

  const handleChevronClick = (): void => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className='c-layers-sidebar__layer-item'
      style={{
        background: isSelected
        ? theme.palette.primary
        : theme.background.z1
      }}>
      <span
        className='c-sidebar-layer__name'
        style={{
          paddingLeft: depth * 16,
          color: isSelected
          ? theme.text.onPrimary
          : theme.text.base
        }}
        onClick={handleNameClick}>
        {layer.layer.name}
      </span>
      {
        isGroup
        ? <span
            className='c-sidebar-layer__chevron'
            onClick={handleChevronClick}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{
                fill: isSelected
                ? theme.text.onPrimary
                : theme.text.lighter
              }}>
              {
                isOpen
                ? <path d="M7 10l5 5 5-5H7z"/>
                : <path d='M10 17l5-5-5-5v10z' />
              }
            </svg>
          </span>
        : null
      }
    </div>
  );
}

export default SidebarLayerItem;