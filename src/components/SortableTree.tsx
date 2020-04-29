import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import { insertLayerAbove, insertLayerBelow, addLayerChild } from '../store/actions/layer';
import { InsertLayerAbovePayload, InsertLayerBelowPayload, AddLayerChildPayload } from '../store/actionTypes/layer';
import { LayerTypes } from '../store/actionTypes/layer';

interface SidebarTreeProps {
  treeData: em.Group;
  nodeComponent: ReactElement;
  layerById: {
    [id: string]: em.Layer;
  };
  insertLayerAbove(payload: InsertLayerAbovePayload): LayerTypes;
  insertLayerBelow(payload: InsertLayerBelowPayload): LayerTypes;
  addLayerChild(payload: AddLayerChildPayload): LayerTypes;
}

const SidebarTree = (props: SidebarTreeProps): ReactElement => {
  const [dragLayer, setDragLayer] = useState(null);
  const [dragEnterLayer, setDragEnterLayer] = useState(null);
  const [dropzone, setDropzone] = useState(null);
  const { treeData, nodeComponent, layerById, insertLayerAbove, insertLayerBelow, addLayerChild } = props;

  const canMoveLayer = (layer: em.Layer): boolean => {
    if (dragLayer.id !== layer.id) {
      if (dragLayer.children) {
        let canInclude = true;
        let currentNode = layer;
        while(layerById[currentNode.parent] && layerById[currentNode.parent].type === 'Group') {
          currentNode = layerById[currentNode.parent];
          if (currentNode.id === dragLayer.id) {
            canInclude = false;
          }
        }
        return canInclude;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  const handleDragStart = (e: any): void => {
    if (e.target.id) {
      e.target.style.opacity = 0.5;
      setDragLayer(layerById[e.target.id]);
    }
  }

  const handleDragEnd = (e: any): void => {
    e.target.style.opacity = 1;
    setDragLayer(null);
    setDragEnterLayer(null);
    setDropzone(null);
  }

  const handleDragOver = (e: any): void => {
    e.preventDefault();
  }

  const handleDragEnter = (e: any): void => {
    if (e.target.dataset.dropzone) {
      const layer = layerById[e.target.dataset.id];
      setDragEnterLayer(canMoveLayer(layer) ? layer : null);
      setDropzone(e.target.dataset.dropzone);
    }
  }

  const handleDragLeave = (e: any): void => {
  }

  const handleDrop = (e: any): void => {
    e.preventDefault();
    if (dragLayer && dragEnterLayer) {
      switch(dropzone) {
        case 'Top':
          insertLayerAbove({
            id: dragLayer.id,
            above: dragEnterLayer.id
          });
          break;
        case 'Center':
          addLayerChild({
            id: dragEnterLayer.id,
            child: dragLayer.id
          });
          break;
        case 'Bottom':
          insertLayerBelow({
            id: dragLayer.id,
            below: dragEnterLayer.id
          });
          break;
      }
    }
    setDragLayer(null);
    setDragEnterLayer(null);
    setDropzone(null);
  }

  return (
    <div
      id={treeData.id}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      >
      {
        dragLayer
        ? <SidebarDropzone
            layer={treeData as em.Group}
            depth={0}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        : null
      }
      {
        treeData.children.map((layer: string, index: number) => (
          React.cloneElement(nodeComponent, {
            key: index,
            layer: layer,
            dragLayer: dragLayer,
            dragEnterLayer: dragEnterLayer,
            dropzone: dropzone,
            depth: 0
          })
        ))
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  return {
    layerById: layer.byId
  };
};

export default connect(
  mapStateToProps,
  { insertLayerAbove, insertLayerBelow, addLayerChild }
)(SidebarTree);