import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerStyles from './SidebarLayerStyles';
import SidebarArtboardSizes from './SidebarArtboardSizes';
import SidebarEmptyState from './SidebarEmptyState';

interface SidebarRightProps {
  isOpen: boolean;
  activeTool: em.ToolType;
  selected: string[];
  sidebarWidth: number;
  ready: boolean;
}

const SidebarRight = (props: SidebarRightProps): ReactElement => {
  const { isOpen, selected, activeTool, sidebarWidth, ready } = props;
  return (
    isOpen
    ? <Sidebar
        width={sidebarWidth}
        position='right'>
        {
          activeTool !== 'Artboard' && selected.length === 0
          ? <SidebarEmptyState
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

const mapStateToProps = (state: RootState) => {
  const { layer, documentSettings, canvasSettings } = state;
  const isOpen = documentSettings.view.rightSidebar.isOpen;
  const selected = layer.present.selected;
  const activeTool = canvasSettings.activeTool;
  const sidebarWidth = documentSettings.view.rightSidebar.width;
  return { isOpen, selected, activeTool, sidebarWidth };
};

export default connect(
  mapStateToProps
)(SidebarRight);