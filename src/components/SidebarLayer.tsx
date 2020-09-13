import React, { ReactElement, useState, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerProps {
  layer: string;
  selected?: string[];
  dragLayers: string[];
  depth: number;
  layerItem?: em.Layer;
  dragging: boolean;
  dragGhost?: boolean;
  hasChildren?: boolean;
  setDragging(dragging: boolean): void;
  setDragLayers(layers: string[]): void;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const [draggable, setDraggable] = useState(true);
  const { layer, depth, dragGhost, dragLayers, setDragLayers, layerItem, selected, dragging, setDragging, hasChildren } = props;

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    if (e.buttons !== 2) {
      if (selected.length > 0 && selected.includes(layer)) {
        setDragLayers(selected);
      } else {
        setDragLayers([layer]);
      }
    }
  }

  const handleMouseUp = (e: any) => {
    setDragLayers(null);
  }

  const handleDragStart = (e: any) => {
    setDragging(true);
    e.dataTransfer.setDragImage(document.getElementById('sidebarDragGhosts'), 0, 0);
  }

  const handleDragEnd = (e: any) => {
    setDragLayers(null);
    setDragging(false);
  }

  return (
    <div
      id={dragGhost ? `${layer}-dragGhost` : layer}
      draggable={draggable}
      className='c-sidebar-layer'
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        opacity: !dragGhost && dragging && dragLayers && dragLayers.includes(layer) ? 0.5 : 1
      }}>
      <SidebarLayerItem
        dragGhost={dragGhost}
        layer={layer}
        depth={depth}
        setDraggable={setDraggable} />
      {
        dragging && !dragGhost
        ? <SidebarDropzone
            layer={layerItem}
            depth={depth}
            dragLayers={dragLayers}
            setDragLayers={setDragLayers}
            setDragging={setDragging} />
        : null
      }
      {
        hasChildren && (layerItem as em.Group | em.Artboard).showChildren
        ? <SidebarLayers
            layers={[...(layerItem as em.Group | em.Artboard).children].reverse()}
            depth={depth + 1}
            dragLayers={dragLayers}
            setDragLayers={setDragLayers}
            setDragging={setDragging}
            dragging={dragging}
            dragGhost={dragGhost} />
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerProps) => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const selected = layer.present.selected;
  const hasChildren = layerItem.type === 'Group' || layerItem.type === 'Artboard';
  return { layerItem, selected, hasChildren };
};

export default connect(
  mapStateToProps
)(SidebarLayer);