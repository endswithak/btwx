import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayerChildren from './SidebarLayerChildren';
import { orderLayersByDepth } from '../store/selectors/layer';

interface SidebarLayerDragGhostsProps {
  orderedLayers?: string[];
  leftSidebarWidth?: number;
}

const SidebarLayerDragGhosts = (props: SidebarLayerDragGhostsProps): ReactElement => {
  const { orderedLayers, leftSidebarWidth } = props;

  return (
    <div
      id='sidebarDragGhosts'
      style={{
        position: 'fixed',
        width: leftSidebarWidth,
        left: 999999999999
      }}>
      {
        orderedLayers.map((layer, index) => (
          <div
            id={`ghost-${layer}`}
            key={index}
            draggable
            className='c-sidebar-layer'>
            <SidebarLayerItem
              layer={layer} />
            <SidebarLayerChildren
              layer={layer} />
          </div>
        ))
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer, viewSettings } = state;
  const orderedLayers = orderLayersByDepth(layer.present, layer.present.selected);
  const leftSidebarWidth = viewSettings.leftSidebar.width;
  return { orderedLayers, leftSidebarWidth };
};

export default connect(
  mapStateToProps
)(SidebarLayerDragGhosts);