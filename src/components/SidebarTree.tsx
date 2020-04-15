import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { store } from '../store';
import SidebarLayer from './SidebarLayer';
import TreeNode from '../canvas/base/treeNode';
import SidebarDropzone from './SidebarDropzone';

const SidebarTree = (): ReactElement => {
  const treeRef = useRef<HTMLDivElement>(null);
  const globalState = useContext(store);
  const { dispatch, paperApp, treeData, dragLayer, dragEnterLayer, dropzone } = globalState;

  const canAddLayer = (layer: TreeNode) => {
    let contains = false;
    dragLayer.contains((child: TreeNode) => {
      if (child.id === layer.id) {
        contains = true;
      }
    })
    return contains ? false : true;
  }

  const handleDragStart = (e) => {
    if (e.target.id) {
      e.target.style.opacity = 0.5;
      treeData.contains((layer: TreeNode) => {
        if (layer.id === e.target.id) {
          dispatch({
            type: 'set-drag-layer',
            dragLayer: layer
          });
        }
      });
    }
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
    dispatch({
      type: 'clear-layer-drag-drop'
    });
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDragEnter = (e) => {
    if (e.target.dataset.dropzone) {
      treeData.contains((layer: TreeNode) => {
        if (layer.id === e.target.dataset.id) {
          dispatch({
            type: 'set-dropzone',
            dragEnterLayer: canAddLayer(layer) ? layer : null,
            dropzone: e.target.dataset.dropzone
          });
        }
      });
    }
  }

  const handleDragLeave = (e) => {
  }

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragLayer && dragEnterLayer) {
      switch(dropzone) {
        case 'top':
          dispatch({
            type: 'add-node-at',
            node: dragLayer,
            toNode: dragEnterLayer.parent,
            index: dragEnterLayer.getIndex()
          });
          break;
        case 'center':
          dispatch({
            type: 'add-node',
            node: dragLayer,
            toNode: dragEnterLayer
          });
          break;
        case 'bottom':
          dispatch({
            type: 'add-node-below',
            node: dragLayer,
            belowNode: dragEnterLayer
          });
          break;
      }
    }
    dispatch({
      type: 'clear-layer-drag-drop'
    });
  }

  return (
    <div
      ref={treeRef}
      id={paperApp.page.id}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}>
      {
        dragLayer
        ? <SidebarDropzone
            id={paperApp.page.id}
            depth={0}
            canHaveChildren={paperApp.page.canHaveChildren} />
        : null
      }
      {
        treeData.root.children.map((layer: TreeNode, index: number) => (
          <SidebarLayer
            key={index}
            index={index}
            layer={layer}
            depth={0} />
        ))
      }
    </div>
  )
}

export default SidebarTree;