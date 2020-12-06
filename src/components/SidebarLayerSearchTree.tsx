import React, { ReactElement, memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeTree as Tree } from '../../react-vtree';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSearchTreeWalker, getLayersWithSearch } from '../store/selectors/layer';
import SidebarLayer from './SidebarLayer';
import SidebarLeftSearchEmptyState from './SidebarLeftSearchEmptyState';

interface SidebarLayerTreeProps {
  treeWalker: any;
  isEmpty: boolean;
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const { treeWalker, isEmpty } = props;

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
          {({height, width}) => (
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

const mapStateToProps = (state: RootState) => ({
  treeWalker: getSearchTreeWalker(state),
  isEmpty: getLayersWithSearch(state).length === 0
});

export default connect(
  mapStateToProps
)(SidebarLayerTree);