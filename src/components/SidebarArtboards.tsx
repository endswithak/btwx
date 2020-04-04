import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import SidebarArtboard from './SidebarArtboard';

const SidebarArtboards = (): ReactElement => {
  const globalState = useContext(store);
  const { artboards } = globalState;

  return (
    <div>
      {
        artboards.length > 0
        ? artboards.map((artboard: paper.Group, index: number) => (
            <SidebarArtboard
              key={index}
              artboard={artboard}
              depth={0}
              path={`${artboard.id}`} />
          ))
        : null
      }
    </div>
  );
}

export default SidebarArtboards;