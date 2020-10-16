import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarLayer from './SidebarLayer';

interface SidebarLayerDragGhostsProps {
  selected?: string[];
  leftSidebarWidth?: number;
}

const SidebarLayerDragGhosts = (props: SidebarLayerDragGhostsProps): ReactElement => {
  const { selected, leftSidebarWidth } = props;

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
            layer={layer}
            isDragGhost />
        ))
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer, viewSettings } = state;
  const selected = [...layer.present.selected].reverse();
  const leftSidebarWidth = viewSettings.leftSidebar.width;
  return { selected, leftSidebarWidth };
};

export default connect(
  mapStateToProps
)(SidebarLayerDragGhosts);