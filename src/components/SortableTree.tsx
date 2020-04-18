import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { store } from '../store';
import LayerNode from '../canvas/base/layerNode';
import TreeNode from '../canvas/base/treeNode';
import SidebarDropzone from './SidebarDropzone';
import StyleNode from '../canvas/base/styleNode';

interface SidebarTreeProps {
  treeData: TreeNode;
  nodeComponent: ReactElement;
}

const SidebarTree = (props: SidebarTreeProps): ReactElement => {
  const [dragLayer, setDragLayer] = useState(null);
  const [dragEnterLayer, setDragEnterLayer] = useState(null);
  const [dropzone, setDropzone] = useState(null);
  const globalState = useContext(store);
  const { dispatch } = globalState;
  const { treeData, nodeComponent } = props;

  const canAddLayer = (layer: TreeNode): boolean => {
    let contains = false;
    dragLayer.contains((child: TreeNode) => {
      if (child.id === layer.id) {
        contains = true;
      }
    })
    return contains ? false : true;
  }

  const handleDragStart = (e: any): void => {
    if (e.target.id) {
      e.target.style.opacity = 0.5;
      treeData.contains((layer: TreeNode) => {
        if (layer.id === e.target.id) {
          setDragLayer(layer);
        }
      });
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
      treeData.contains((layer: TreeNode) => {
        if (layer.id === e.target.dataset.id) {
          setDragEnterLayer(canAddLayer(layer) ? layer : null);
          setDropzone(e.target.dataset.dropzone);
        }
      });
    }
  }

  const handleDragLeave = (e: any): void => {
  }

  const handleDrop = (e: any): void => {
    e.preventDefault();
    if (dragLayer && dragEnterLayer) {
      switch(dropzone) {
        case 'Top':
          dispatch({
            type: 'add-node-at',
            node: dragLayer,
            toNode: dragEnterLayer.parent,
            index: dragEnterLayer.getIndex()
          });
          break;
        case 'Center':
          dispatch({
            type: 'add-node',
            node: dragLayer,
            toNode: dragEnterLayer
          });
          break;
        case 'Bottom':
          dispatch({
            type: 'add-node-below',
            node: dragLayer,
            belowNode: dragEnterLayer
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
      onDragEnd={handleDragEnd}>
      {
        dragLayer
        ? <SidebarDropzone
            layer={treeData as LayerNode | StyleNode}
            depth={0}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        : null
      }
      {
        treeData.children.map((layer: LayerNode | StyleNode, index: number) => (
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

export default SidebarTree;