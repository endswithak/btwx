import React, { ReactElement, useState, useRef } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayer from './SidebarLayer';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';

interface SidebarLayerTreeProps {
  page: em.Group;
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const [dragging, setDragging] = useState(false);
  const [dragLayers, setDragLayers] = useState<string[]>(null);
  const { page } = props;

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
        ? <SidebarLayerDragGhosts
            dragLayers={dragLayers}
            dragging={dragging} />
        : null
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  return {
    page: layer.present.byId[layer.present.page]
  };
};

export default connect(
  mapStateToProps
)(SidebarLayerTree);