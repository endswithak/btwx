import React, { ReactElement, useEffect, memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeTree as Tree } from '../../react-vtree';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getTreeWalker } from '../store/selectors/layer';
import { setRef } from '../store/actions/leftSidebar';
import { LeftSidebarTypes, SetRefPayload } from '../store/actionTypes/leftSidebar';
import SidebarLayer from './SidebarLayer';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';
import SidebarLeftEmptyState from './SidebarLeftEmptyState';

interface SidebarLayerTreeProps {
  treeWalker?: any;
  isEmpty?: boolean;
  searchActive?: boolean;
  setRef?(payload: SetRefPayload): LeftSidebarTypes;
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const { setRef, treeWalker, isEmpty, searchActive } = props;

  useEffect(() => {
    console.log('LAYER TREEEEEE');
  }, []);

  useEffect(() => {
    console.log('TREEEEE WALKER');
  }, [treeWalker]);

  const handleRef = (newRef: Tree): void => {
    setRef({ref: newRef});
  }

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
    ? <SidebarLeftEmptyState />
    : <div
        className='c-sidebar__vtree'
        style={{
          opacity: searchActive ? 0 : 1
        }}>
        <AutoSizer>
          {({height, width}) => (
            <Tree
              treeWalker={treeWalker}
              itemSize={32}
              height={height}
              width={width}
              ref={handleRef}>
              {Node}
            </Tree>
          )}
        </AutoSizer>
        <SidebarLayerDragGhosts />
      </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  treeWalker: getTreeWalker(state),
  isEmpty: state.layer.present.childrenById.root.length === 0,
  searchActive: state.leftSidebar.search.replace(/\s/g, '').length > 0
});

export default connect(
  mapStateToProps,
  { setRef }
)(SidebarLayerTree);