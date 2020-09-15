import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerStyles from './SidebarLayerStyles';
import SidebarArtboardSizes from './SidebarArtboardSizes';
import SidebarEmptyState from './SidebarEmptyState';

interface SidebarRightProps {
  isOpen: boolean;
  toolType: em.ToolType;
  selected: string[];
  sidebarWidth: number;
  ready: boolean;
}

const SidebarRight = (props: SidebarRightProps): ReactElement => {
  const { isOpen, selected, toolType, sidebarWidth, ready } = props;
  return (
    isOpen
    ? <Sidebar
        width={sidebarWidth}
        position='right'>
        {
          toolType !== 'Artboard' && selected.length === 0
          ? <SidebarEmptyState
              icon='right-sidebar'
              text='Styles'
              detail={<span>View and edit document<br/> layer styles here.</span>} />
          : null
        }
        {
          ready && toolType !== 'Artboard' && selected.length > 0
          ? <SidebarLayerStyles />
          : null
        }
        {
          ready && toolType === 'Artboard'
          ? <SidebarArtboardSizes />
          : null
        }
      </Sidebar>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tool, canvasSettings, rightSidebar } = state;
  const isOpen = rightSidebar.isOpen;
  const selected = layer.present.selected;
  const toolType = tool.type;
  const sidebarWidth = canvasSettings.rightSidebarWidth;
  return { isOpen, selected, toolType, sidebarWidth };
};

export default connect(
  mapStateToProps
)(SidebarRight);