import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getReverseSelected } from '../store/selectors/layer';
import SidebarLayer from './SidebarLayer';

const SidebarLayerDragGhosts = (): ReactElement => {
  const selected = useSelector((state: RootState) => getReverseSelected(state));
  const leftSidebarWidth = useSelector((state: RootState) => state.viewSettings.leftSidebar.width);

  useEffect(() => {
    console.log('DRAG GHOSTS');
  }, []);

  return (
    <div
      id='sidebarDragGhosts'
      style={{
        position: 'fixed',
        width: leftSidebarWidth,
        left: 999999999999,
        opacity: 0.5
      }}>
      {
        selected.map((layer, index) => (
          <SidebarLayer
            key={index}
            id={layer}
            isDragGhost />
        ))
      }
    </div>
  )
}

export default SidebarLayerDragGhosts;