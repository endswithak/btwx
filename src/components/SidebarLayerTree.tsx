import React, { ReactElement, useState, useRef } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayer from './SidebarLayer';
import { orderLayersByDepth } from '../store/selectors/layer';
import { LayerState } from '../store/reducers/layer';

interface SidebarLayerTreeProps {
  page: em.Group;
  layerbyId: {
    [id: string]: em.Layer;
  };
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const [dragging, setDragging] = useState(false);
  const [dragLayers, setDragLayers] = useState<string[]>(null);
  const { page, layerbyId } = props;

  return (
    <div>
      {
        dragging
        ? <SidebarDropzone
            layer={page}
            depth={0}
            dragLayers={dragLayers}
            setDragging={setDragging}
            setDragLayers={setDragLayers} />
        : null
      }
      {
        page.children.map((layer: string, index: number) => (
          <SidebarLayer
            key={index}
            layer={layer}
            dragLayers={dragLayers}
            setDragLayers={setDragLayers}
            dragging={dragging}
            setDragging={setDragging}
            depth={0} />
        ))
      }
      {
        dragLayers
        ? <div
            id='sidebarDragGhosts'
            style={{
              position: 'fixed',
              width: '100%',
              left: 99999999
            }}>
            {
              orderLayersByDepth({byId: layerbyId} as LayerState, dragLayers).map((id, index) => (
                <SidebarLayer
                  dragGhost
                  key={index}
                  layer={id}
                  dragLayers={dragLayers}
                  setDragLayers={() => {return;}}
                  dragging={dragging}
                  setDragging={() => {return;}}
                  depth={0} />
              ))
            }
          </div>
        : null
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  return {
    page: layer.present.byId[layer.present.page],
    layerbyId: layer.present.byId
  };
};

export default connect(
  mapStateToProps
)(SidebarLayerTree);