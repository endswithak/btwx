import React, { ReactElement, useEffect, useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getTreeWalker } from '../store/selectors/layer';
import { setLayerTreeStickyArtboard } from '../store/actions/layer';
import SidebarLayer from './SidebarLayer';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';
import SidebarLeftEmptyState from './SidebarLeftEmptyState';
import { FixedSizeTree as Tree } from './react-vtree';

const SidebarLayerTree = (): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<Tree>(null);
  const treeWalker = useSelector((state: RootState) => getTreeWalker(state));
  const isEmpty = useSelector((state: RootState) => state.layer.present.byId.root.children.length === 0);
  const searchActive = useSelector((state: RootState) => state.leftSidebar.search.replace(/\s/g, '').length > 0);
  const scroll = useSelector((state: RootState) => state.layer.present.tree.scroll);
  const scrollType = useSelector((state: RootState) => scroll && state.layer.present.tree.byId[scroll] ? state.layer.present.tree.byId[scroll].type : null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedType = useSelector((state: RootState) => selected.length > 0 && state.layer.present.tree.byId[state.layer.present.selected[0]] ? state.layer.present.tree.byId[state.layer.present.selected[0]].type : null);
  const stickyArtboard = useSelector((state: RootState) => state.layer.present.tree.stickyArtboard);
  const stickyArtboardItem = useSelector((state: RootState) => stickyArtboard && state.layer.present.tree.byId[stickyArtboard] ? state.layer.present.tree.byId[stickyArtboard] : null);
  const stickyArtboardOpen = stickyArtboardItem ? stickyArtboardItem.showChildren : false;
  const dispatch = useDispatch();

  useEffect(() => {
    if (treeRef.current) {
      treeRef.current.scrollToItem(
        scroll,
        scrollType === 'Artboard' ? 'start' : 'center'
      );
    }
  }, [scroll]);

  useEffect(() => {
    if (treeRef.current && !searchActive && selected.length > 0) {
      treeRef.current.scrollToItem(
        selected[0],
        selectedType === 'Artboard' ? 'start' : 'center'
      );
    }
  }, [searchActive]);

  const Node = ({data, style, isOpen, setOpen}) => (
    data.id === stickyArtboard
    ? null
    : <SidebarLayer
        {...data}
        style={style}
        isOpen={isOpen}
        setOpen={setOpen}
        draggable={true} />
  );

  const handleItemsRendered = ({
    visibleStartIndex
  }): any => {
    if (treeRef.current) {
      const visibleStartData = treeRef.current.getRecordData(visibleStartIndex);
      const visibleStartArtboard = (visibleStartData.data as any).artboard;
      if (outerRef.current.scrollHeight > containerRef.current.scrollHeight) {
        if (stickyArtboard !== visibleStartArtboard) {
          dispatch(setLayerTreeStickyArtboard({
            stickyArtboard: visibleStartArtboard
          }));
        }
      } else {
        if (stickyArtboard) {
          dispatch(setLayerTreeStickyArtboard({
            stickyArtboard: null
          }));
        }
      }
    }
  };

  return (
    isEmpty
    ? <SidebarLeftEmptyState />
    : <div
        className='c-sidebar__vtree'
        ref={containerRef}
        style={{
          opacity: searchActive ? 0 : 1
        }}>
        <AutoSizer>
          {({height, width}): ReactElement => (
            <Tree
              treeWalker={treeWalker}
              itemSize={32}
              height={height}
              onItemsRendered={handleItemsRendered}
              width={width}
              outerRef={outerRef}
              ref={treeRef}>
              {Node}
            </Tree>
          )}
        </AutoSizer>
        {
          stickyArtboard
          ? <SidebarLayer
              id={stickyArtboard}
              sticky
              nestingLevel={0}
              isOpen={stickyArtboardOpen}
              setOpen={() => {return;}}
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: 32,
                left: 0,
              }}
              draggable={true} />
          : null
        }
        <SidebarLayerDragGhosts />
      </div>
  )
}

export default SidebarLayerTree;

////////////////////////////////////////////////////////
// scaffolding for animated sticky header...
// whenever I get around to it
////////////////////////////////////////////////////////

// const rootChildren = useSelector((state: RootState) => state.layer.present.tree.byId.root ? state.layer.present.tree.byId.root.children : null);
// const [overscanArtboard, setOverscanArtboard] = useState(null);
// const [visibleArtboard, setVisibleArtboard] = useState(null);
// const [overscanArtboardActive, setOverscanArtboardActive] = useState(null);
// const handleItemsRendered = ({
//   overscanStartIndex,
//   overscanStopIndex,
//   visibleStartIndex,
//   visibleStopIndex
// }): any => {
//   if (treeRef.current) {
//     const visibleStartData = treeRef.current.getRecordData(visibleStartIndex);
//     const visibleStartArtboard = (visibleStartData.data as any).artboard;
//     if (outerRef.current.scrollHeight > containerRef.current.scrollHeight) {
//       if (stickyArtboard !== visibleStartArtboard) {
//         dispatch(setLayerTreeStickyArtboard({
//           stickyArtboard: visibleStartArtboard
//         }));
//       }
//     } else {
//       if (stickyArtboard) {
//         dispatch(setLayerTreeStickyArtboard({
//           stickyArtboard: null
//         }));
//       }
//     }
//     const overscanStartData = ref.current.getRecordData(overscanStartIndex);
//     const visibleStopData = ref.current.getRecordData(visibleStopIndex);
//     const overscanStopData = ref.current.getRecordData(overscanStopIndex);
//     const overscanStartArtboard = (overscanStartData as any).artboard;
//     const visibleStopArtboard = (visibleStopData.data as any).artboard;
//     const overscanStopArtboard = (overscanStopData as any).artboard;
//     if (overscanArtboard === (overscanStartData as any).id) {
//       setOverscanArtboardActive(true);
//     } else {
//       if (overscanArtboardActive) {
//         setOverscanArtboardActive(false);
//       }
//     }
//     if (overscanArtboard !== overscanStartArtboard) {
//       setOverscanArtboard(overscanStartArtboard);
//     }
//     if (visibleArtboard !== visibleStartArtboard) {
//       setVisibleArtboard(visibleStartArtboard);
//     }
//   }
// };

// const handleScroll = ({
//   scrollDirection,
//   scrollOffset,
//   scrollUpdateWasRequested
// }) => {

// };