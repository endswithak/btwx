import React, { ReactElement, useState, SyntheticEvent } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerProps {
  layer: string;
  selected: string[];
  dragLayer: string;
  depth: number;
  layerItem?: em.Layer;
  setDragLayer(id: string): void;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const [draggable, setDraggable] = useState(true);
  const { layer, depth, dragLayer, setDragLayer, layerItem } = props;

  const handleDragStart = (e: SyntheticEvent) => {
    setDragLayer(e.target.id);
  }

  const handleDragEnd = (e: SyntheticEvent) => {
    setDragLayer(null);
  }

  return (
    <div
      id={layer}
      draggable={draggable}
      className='c-sidebar-layer'
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        opacity: dragLayer === layer ? 0.5 : 1
      }}>
      <SidebarLayerItem
        layer={layerItem}
        depth={depth}
        setDraggable={setDraggable} />
      {
        dragLayer
        ? <SidebarDropzone
            layer={layerItem}
            depth={depth}
            dragLayer={dragLayer}
            setDragLayer={setDragLayer} />
        : null
      }
      {
        (layerItem.type === 'Group' || layerItem.type === 'Artboard') && (layerItem as em.Group).showChildren
        ? <SidebarLayers
            layers={(layerItem as em.Group).children}
            depth={depth + 1}
            dragLayer={dragLayer}
            setDragLayer={setDragLayer} />
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerProps) => {
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  const selected = layer.present.selected;
  return { layerItem, selected };
};

export default connect(
  mapStateToProps
)(SidebarLayer);