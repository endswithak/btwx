import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getReverseSelected, getLimitedReverseSelected } from '../store/selectors/layer';
import SidebarLayer from './SidebarLayer';
import ListItem from './ListItem';

const SidebarLayerDragGhosts = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedGhosts = useSelector((state: RootState) => getLimitedReverseSelected(state));
  const leftSidebarWidth = useSelector((state: RootState) => state.viewSettings.leftSidebar.width);

  return (
    <div
      id='sidebar-drag-ghosts'
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
      }
      {
        selected.length > selectedGhosts.length
        ? <ListItem
            as='div'>
            <ListItem.Body>
              <ListItem.Text
                size='small'
                variant='lightest'>
                + { selected.length - selectedGhosts.length } more...
              </ListItem.Text>
            </ListItem.Body>
          </ListItem>
        : null
      }
    </div>
  )
}

export default SidebarLayerDragGhosts;