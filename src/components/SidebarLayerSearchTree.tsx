import React, { ReactElement, useEffect, useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSearchTreeWalker, getLayersWithSearch } from '../store/selectors/layer';
import SidebarLayer from './SidebarLayer';
import SidebarLeftSearchEmptyState from './SidebarLeftSearchEmptyState';
import { FixedSizeTree as Tree } from './react-vtree';

const SidebarLayerTree = (): ReactElement => {
  const ref = useRef<Tree>(null);
  const treeWalker = useSelector((state: RootState) => getSearchTreeWalker(state));
  const isEmpty = useSelector((state: RootState) => getLayersWithSearch(state).length === 0);
  const scroll = useSelector((state: RootState) => state.layer.present.tree.scroll);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToItem(scroll, 'start');
    }
  }, [scroll]);

  const Node = ({data, style, isOpen, setOpen}) => (
    <SidebarLayer
      {...data}
      isOpen={isOpen}
      setOpen={setOpen}
      style={style}
      draggable={false}
      searchTree />
  );

  return (
    isEmpty
    ? <SidebarLeftSearchEmptyState />
    : <div className='c-sidebar__vtree'>
        <AutoSizer>
          {({height, width}): ReactElement => (
            <Tree
              treeWalker={treeWalker}
              itemSize={32}
              height={height}
              width={width}
              ref={ref}>
              {Node}
            </Tree>
          )}
        </AutoSizer>
      </div>
  )
}

export default SidebarLayerTree;