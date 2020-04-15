import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';
import TreeNode from '../canvas/base/treeNode';

interface SidebarLayerChevronProps {
  layer: TreeNode;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const globalState = useContext(store);
  const { dispatch, theme } = globalState;
  const { layer } = props;

  const handleChevronClick = (): void => {
    dispatch({
      type: 'expand-node',
      node: layer
    });
  }

  return (
    layer.canHaveChildren
    ? <div
        className='c-sidebar-layer__chevron'
        onClick={handleChevronClick}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            fill: layer.selected
            ? theme.text.onPrimary
            : theme.text.lighter
          }}>
          {
            layer.expanded
            ? <path d="M7 10l5 5 5-5H7z"/>
            : <path d='M10 17l5-5-5-5v10z' />
          }
        </svg>
      </div>
    : <div className='c-sidebar-layer__chevron' />
  );
}

export default SidebarLayerChevron;