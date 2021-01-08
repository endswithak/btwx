import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getReverseSelected, getLimitedReverseSelected } from '../store/selectors/layer';
import SidebarLayer from './SidebarLayer';

const SidebarLayerDragGhosts = (): ReactElement => {
  // const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedGhosts = useSelector((state: RootState) => getLimitedReverseSelected(state));
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
        selectedGhosts.map((id, index) => (
          <SidebarLayer
            key={id}
            id={id}
            isDragGhost />
        ))
        // need to add + indicator
      }
    </div>
  )
}

export default SidebarLayerDragGhosts;