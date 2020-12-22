import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerStyles from './SidebarLayerStyles';
import SidebarArtboardSizes from './SidebarArtboardSizes';
import EmptyState from './EmptyState';

const SidebarRight = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const isOpen = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const sidebarWidth = useSelector((state: RootState) => state.viewSettings.rightSidebar.width);

  return (
    isOpen
    ? <Sidebar
        width={sidebarWidth}
        position='right'>
        {
          activeTool !== 'Artboard' && selected.length === 0
          ? <EmptyState
              icon='right-sidebar'
              text='Styles'
              style={{width: 211}} />
          : null
        }
        {
          ready && activeTool !== 'Artboard' && selected.length > 0
          ? <SidebarLayerStyles />
          : null
        }
        {
          ready && activeTool === 'Artboard'
          ? <SidebarArtboardSizes />
          : null
        }
      </Sidebar>
    : null
  );
}

export default SidebarRight;