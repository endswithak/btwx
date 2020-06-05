import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import SidebarLayerStyles from './SidebarLayerStyles';
//import SidebarArtboardStyles from './SidebarArtboardStyles';

interface SidebarRightProps {
  toolType: em.ToolType;
  artboardSelected: boolean;
  layerSelected: boolean;
}

const SidebarRight = (props: SidebarRightProps): ReactElement => {
  const { artboardSelected, layerSelected, toolType } = props;
  return (
    <Sidebar
      width={280}
      position={'right'}
      resizable={false}>
      {
        toolType !== 'Artboard' && artboardSelected
        ? <SidebarArtboardStyles />
        : null
      }
      {
        toolType !== 'Artboard' && layerSelected
        ? <SidebarLayerStyles />
        : null
      }
    </Sidebar>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tool } = state;
  const selected = layer.present.selected;
  const artboardSelected = selected.some((id: string) => layer.present.artboards.includes(id));
  const layerSelected = selected.some((id: string) => !layer.present.artboards.includes(id));
  const toolType = tool.type;
  return { selected, artboardSelected, layerSelected, toolType };
};

export default connect(
  mapStateToProps
)(SidebarRight);