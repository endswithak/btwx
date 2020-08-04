import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import SidebarLayerStyles from './SidebarLayerStyles';
import { RootState } from '../store/reducers';
//import SidebarArtboardStyles from './SidebarArtboardStyles';
import SidebarArtboardSizes from './SidebarArtboardSizes';

interface SidebarRightProps {
  isOpen: boolean;
  toolType: em.ToolType;
  artboardSelected: boolean;
  layerSelected: boolean;
  sidebarWidth: number;
  ready: boolean;
}

const SidebarRight = (props: SidebarRightProps): ReactElement => {
  const { isOpen, artboardSelected, layerSelected, toolType, sidebarWidth, ready } = props;
  return (
    isOpen
    ? <Sidebar
        width={sidebarWidth}
        position='right'>
        {/* {
          toolType !== 'Artboard' && artboardSelected
          ? <SidebarArtboardStyles />
          : null
        } */}
        {
          ready && toolType !== 'Artboard' && layerSelected
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
  const artboardSelected = selected.some((id: string) => layer.present.allArtboardIds.includes(id));
  const layerSelected = selected.some((id: string) => !layer.present.allArtboardIds.includes(id));
  const toolType = tool.type;
  const sidebarWidth = canvasSettings.rightSidebarWidth;
  return { isOpen, selected, artboardSelected, layerSelected, toolType, sidebarWidth };
};

export default connect(
  mapStateToProps
)(SidebarRight);