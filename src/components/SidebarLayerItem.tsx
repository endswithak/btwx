import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';

interface SidebarLayerItemProps {
  layer: FileFormat.AnyLayer;
  path: string;
  depth: number;
  isGroup?: boolean;
  isOpen?: boolean;
  setIsOpen?: any;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const globalState = useContext(store);
  const { dispatch } = globalState;
  const { layer, path, depth, isGroup, isOpen, setIsOpen } = props;

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
    <div className='c-layers-sidebar__layer-item'>
      <span
        className='c-sidebar-layer__name'
        style={{paddingLeft: depth * 16}}
        onClick={handleNameClick}>
        {layer.name}
      </span>
      {
        isGroup
        ? <span
            className='c-sidebar-layer__chevron'
            onClick={handleChevronClick}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              {
                isOpen
                ? <path fill="#000" d="M7 10l5 5 5-5H7z"/>
                : <path fill="#000" d='M10 17l5-5-5-5v10z' />
              }
            </svg>
          </span>
        : null
      }
    </div>
  );
}

export default SidebarLayerItem;