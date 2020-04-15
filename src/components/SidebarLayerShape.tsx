import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';
import TreeNode from '../canvas/base/treeNode';

interface SidebarLayerShapeProps {
  layer: TreeNode;
}

const SidebarLayerShape = (props: SidebarLayerShapeProps): ReactElement => {
  const globalState = useContext(store);
  const { dispatch, theme } = globalState;
  const { layer } = props;

  return (
    layer.preview
    ? <div className='c-sidebar-layer__shape'>
        <svg
          width="18"
          height="18"
          viewBox="-1 -1 18 18"
          style={{
            strokeWidth: 1,
            stroke: layer.selected
            ? theme.text.onPrimary
            : theme.text.lighter,
            fill: theme.text.lightest
          }}>
            <path d={layer.preview} />
          </svg>
      </div>
    : null
  );
}

export default SidebarLayerShape;