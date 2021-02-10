import React, { ReactElement, useEffect, memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeTree as Tree } from '../../react-vtree';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getTreeWalker } from '../store/selectors/layer';
import SidebarLayer from './SidebarLayer';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';
import SidebarLeftEmptyState from './SidebarLeftEmptyState';

const SidebarLayerTree = (): ReactElement => {
  const treeWalker = useSelector((state: RootState) => getTreeWalker(state));
  const isEmpty = useSelector((state: RootState) => state.layer.present.byId.root.children.length === 0);
  const searchActive = useSelector((state: RootState) => state.leftSidebar.search.replace(/\s/g, '').length > 0);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log('LAYER TREEEEEE');
  // }, []);

  // useEffect(() => {
  //   console.log('TREEEEE WALKER');
  // }, [treeWalker]);

  // const handleRef = (newRef: Tree): void => {
  //   dispatch(setRef({ref: newRef}));
  // }

  const Node = memo(function Node(props: any) {
    const {data, style, isOpen, setOpen} = props;
    return (
      <SidebarLayer
        {...data}
        isOpen={isOpen}
        setOpen={setOpen}
        style={style}
        draggable={true} />
    )
  });

  return (
    isEmpty
    ? <SidebarLeftEmptyState />
    : <div
        className='c-sidebar__vtree'
        style={{
          opacity: searchActive ? 0 : 1
        }}>
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
        <SidebarLayerDragGhosts />
      </div>
  )
}

export default SidebarLayerTree;