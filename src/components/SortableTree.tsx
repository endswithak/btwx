import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import { insertAbove, insertBelow, insertChild } from '../store/actions/layers';
import { InsertAbovePayload, InsertBelowPayload, InsertChildPayload } from '../store/actionTypes/layers';
import { LayersTypes } from '../store/actionTypes/layers';

interface SidebarTreeProps {
  treeData: em.Group;
  nodeComponent: ReactElement;
  layers: {
    [id: string]: em.Layer;
  };
  insertAbove(payload: InsertAbovePayload): LayersTypes;
  insertBelow(payload: InsertBelowPayload): LayersTypes;
  insertChild(payload: InsertChildPayload): LayersTypes;
}

const SidebarTree = (props: SidebarTreeProps): ReactElement => {
  const [dragLayer, setDragLayer] = useState(null);
  const [dragEnterLayer, setDragEnterLayer] = useState(null);
  const [dropzone, setDropzone] = useState(null);
  const { treeData, nodeComponent, layers, insertAbove, insertBelow, insertChild } = props;

  const canMoveLayer = (layer: em.Layer): boolean => {
    if (dragLayer.id !== layer.id) {
      if (dragLayer.children) {
        let canInclude = true;
        let currentNode = layer;
        while(layers[currentNode.parent] && layers[currentNode.parent].type === 'Group') {
          currentNode = layers[currentNode.parent];
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
      setDragLayer(layers[e.target.id]);
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
      const layer = layers[e.target.dataset.id];
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
          insertAbove({
            layer: dragLayer.id,
            above: dragEnterLayer.id
          });
          break;
        case 'Center':
          insertChild({
            layer: dragLayer.id,
            parent: dragEnterLayer.id
          });
          break;
        case 'Bottom':
          insertBelow({
            layer: dragLayer.id,
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
  const { layers } = state;
  return {
    layers: layers.layerById
  };
};

export default connect(
  mapStateToProps,
  { insertAbove, insertBelow, insertChild }
)(SidebarTree);