import React, { ReactElement, useEffect } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeTree as Tree } from '../../react-vtree';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getTreeWalker } from '../store/selectors/layer';
import { setRef } from '../store/actions/leftSidebar';
import { LeftSidebarTypes, SetRefPayload } from '../store/actionTypes/leftSidebar';
import SidebarLayer from './SidebarLayer';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';
import SidebarLeftSearchEmptyState from './SidebarLeftSearchEmptyState';

interface SidebarLayerTreeProps {
  treeWalker: any;
  setRef?(payload: SetRefPayload): LeftSidebarTypes;
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const { setRef, treeWalker } = props;

  useEffect(() => {
    console.log('LAYER TREEEEEE');
  }, []);

  const handleRef = (newRef: Tree): void => {
    setRef({ref: newRef});
  }

  const Node = ({data, style, isOpen, setOpen}: any): ReactElement => (
    <SidebarLayer
      {...data}
      isOpen={isOpen}
      setOpen={setOpen}
      style={style} />
  );

  return (
    <>
      <AutoSizer>
        {({height, width}) => (
          <Tree
            treeWalker={treeWalker}
            itemSize={32}
            height={height}
            width={width}
            ref={handleRef}
            async>
            {Node}
          </Tree>
        )}
      </AutoSizer>
      <SidebarLayerDragGhosts />
    </>
    // <SidebarLeftSearchEmptyState />
  )
}

const mapStateToProps = (state: RootState) => ({
  treeWalker: getTreeWalker(state)
});

export default connect(
  mapStateToProps,
  { setRef }
)(SidebarLayerTree);