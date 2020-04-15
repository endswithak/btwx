import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import TreeNode from '../canvas/base/treeNode';

interface SidebarLayerProps {
  layer: TreeNode;
  index: number;
  depth: number;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, paperApp, treeData, dragLayer } = globalState;
  const { layer, depth } = props;

  return (
    <div
      id={layer.id}
      draggable
      className='c-sidebar-layer'
      style={{
        background: layer.selected
        ? theme.palette.primary
        : 'none'
      }}>
      <SidebarLayerItem
        layer={layer}
        depth={depth} />
      {
        dragLayer
        ? <SidebarDropzone
            id={layer.id}
            depth={depth}
            canHaveChildren={layer.canHaveChildren} />
        : null
      }
      {
        layer.expanded
        ? layer.children.map((layer: TreeNode, index: number) => (
            <SidebarLayer
              key={index}
              index={index}
              layer={layer}
              depth={depth + 1} />
          ))
        : null
      }
    </div>
  );
}

export default SidebarLayer;