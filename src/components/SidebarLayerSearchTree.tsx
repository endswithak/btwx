import React, { ReactElement, memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeTree as Tree } from '../../react-vtree';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSearchTreeWalker, getLayersWithSearch } from '../store/selectors/layer';
import SidebarLayer from './SidebarLayer';
import SidebarLeftSearchEmptyState from './SidebarLeftSearchEmptyState';

const SidebarLayerTree = (): ReactElement => {
  const treeWalker = useSelector((state: RootState) => getSearchTreeWalker(state));
  const isEmpty = useSelector((state: RootState) => getLayersWithSearch(state).length === 0);

  const Node = memo(function Node(props: any) {
    const {data, style, isOpen, setOpen} = props;
    return (
      <SidebarLayer
        {...data}
        isOpen={isOpen}
        setOpen={setOpen}
        style={style} />
    )
  });

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
              width={width}>
              {Node}
            </Tree>
          )}
        </AutoSizer>
      </div>
  )
}

export default SidebarLayerTree;