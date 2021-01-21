import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import ContextMenuLayerEdit from './ContextMenuLayerEdit';
import ContextMenuArtboardCustomPreset from './ContextMenuArtboardCustomPreset';
import ContextMenuEventDrawerEvent from './ContextMenuEventDrawerEvent';

const ContextMenuWrap = (): ReactElement => {
  const contextMenu = useSelector((state: RootState) => state.contextMenu);

  return (
    contextMenu.isOpen
    ? (() => {
        switch(contextMenu.type) {
          case 'ArtboardCustomPreset':
            return <ContextMenuArtboardCustomPreset />;
          case 'EventDrawerEvent':
            return <ContextMenuEventDrawerEvent />;
          case 'LayerEdit':
            return <ContextMenuLayerEdit />;
        }
      })()
    : null
  );
}

export default ContextMenuWrap;