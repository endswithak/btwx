import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarLayer from './SidebarLayer';
import { orderLayersByDepth } from '../store/selectors/layer';

interface SidebarLayerDragGhostsProps {
  orderedLayers?: string[];
}

const SidebarLayerDragGhosts = (props: SidebarLayerDragGhostsProps): ReactElement => {
  const { orderedLayers } = props;

  return (
    <div
      id='sidebarDragGhosts'
      style={{
        position: 'fixed',
        width: '100%',
        left: 999999999999
      }}>
      {
        orderedLayers.map((id, index) => (
          <SidebarLayer
            dragGhost
            key={index}
            layer={id}
            depth={0} />
        ))
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const orderedLayers = orderLayersByDepth(layer.present, layer.present.selected);
  return { orderedLayers };
};

export default connect(
  mapStateToProps
)(SidebarLayerDragGhosts);