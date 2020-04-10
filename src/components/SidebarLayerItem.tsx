import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';
import PaperArtboard from '../canvas/base/artboard';
import PaperGroup from '../canvas/base/group';
import PaperShape from '../canvas/base/shape';

interface SidebarLayerItemProps {
  layer: PaperArtboard | PaperGroup | PaperShape;
  depth: number;
  isGroup?: boolean;
  isOpen?: boolean;
  setIsOpen?: any;
}

const SidebarLayerItem = (props: SidebarLayerItemProps): ReactElement => {
  const globalState = useContext(store);
  const { dispatch, selectedLayer, theme } = globalState;
  const { layer, depth, isGroup, isOpen, setIsOpen } = props;

  const handleNameClick = (): void => {
    // dispatch({
    //   type: 'set-selected-layer',
    //   layer: layer
    // });
  }

  const handleChevronClick = (): void => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className='c-layers-sidebar__layer-item'
      style={{
        background: layer.selected
        ? theme.palette.primary
        : theme.background.z1
      }}>
      <span
        className='c-sidebar-layer__name'
        style={{
          paddingLeft: depth * 16,
          color: layer.selected
          ? theme.text.onPrimary
          : theme.text.base
        }}
        onClick={handleNameClick}>
        {layer.name}
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
                fill: layer.selected
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