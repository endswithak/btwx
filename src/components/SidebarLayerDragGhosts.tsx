import React, { ReactElement, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { getReverseSelected } from '../store/selectors/layer';
import { connect } from 'react-redux';
import SidebarLayer from './SidebarLayer';

interface SidebarLayerDragGhostsProps {
  selected?: string[];
  leftSidebarWidth?: number;
}

const SidebarLayerDragGhosts = (props: SidebarLayerDragGhostsProps): ReactElement => {
  const { selected, leftSidebarWidth } = props;

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

const mapStateToProps = (state: RootState) => {
  const { viewSettings } = state;
  const selected = getReverseSelected(state);
  const leftSidebarWidth = viewSettings.leftSidebar.width;
  return { selected, leftSidebarWidth };
};

export default connect(
  mapStateToProps
)(SidebarLayerDragGhosts);