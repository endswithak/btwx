import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { showLayerChildren, hideLayerChildren, setLayerTreeScroll } from '../store/actions/layer';
import IconButton from './IconButton';

interface SidebarLayerChevronProps {
  id: string;
  isOpen: boolean;
  isDragGhost?: boolean;
  setOpen?(isOpen: boolean): void;
  searchTree?: boolean;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const { id, isDragGhost, isOpen, searchTree, setOpen } = props;
  const isArtboard = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Artboard');
  const canOpen = useSelector((state: RootState) => state.layer.present.byId[id] && (state.layer.present.byId[id].type === 'Group' || state.layer.present.byId[id].type === 'Artboard'  || state.layer.present.byId[id].type === 'CompoundShape'));
  // const isSelected = useSelector((state: RootState) => state.layer.present.byId[id].selected);
  const dispatch = useDispatch();

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    if (isOpen) {
      dispatch(hideLayerChildren({id}));
      if (isArtboard) {
        dispatch(setLayerTreeScroll({scroll: id}));
      }
    } else {
      dispatch(showLayerChildren({id}));
    }
    // setOpen(!isOpen);
  }

  return (
    <div
      className='c-sidebar-layer__icon c-sidebar-layer__icon--chevron'
      id={searchTree ? `search-tree-${id}-open-icon` : `${id}-open-icon`}>
      {
        canOpen
        ? <IconButton
            onMouseDown={canOpen ? handleMouseDown : null}
            iconName={isOpen ? 'thicc-chevron-down' : 'thicc-chevron-right'}
            size='small'
            style={{
              pointerEvents: canOpen ? 'auto' : 'none'
            }} />
        : null
      }
    </div>
  );
}

export default SidebarLayerChevron;