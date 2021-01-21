import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayerTweenEvent } from '../store/actions/layer';
import { setEventDrawerEventThunk } from '../store/actions/eventDrawer';
import ContextMenu from './ContextMenu';

const ContextMenuEventDrawerEvent = (): ReactElement => {
  const contextMenu = useSelector((state: RootState) => state.contextMenu);
  const dispatch = useDispatch();

  const options = [{
    label: 'Edit',
    click: (): void => {
      dispatch(setEventDrawerEventThunk({id: contextMenu.id}));
    }
  },{
    label: 'Remove',
    click: (): void => {
      dispatch(removeLayerTweenEvent({id: contextMenu.id}));
    }
  }] as any[];

  return (
    <ContextMenu
      options={options} />
  );
}

export default ContextMenuEventDrawerEvent;