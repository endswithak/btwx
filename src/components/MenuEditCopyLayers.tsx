/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copyLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopy';

interface MenuEditCopyLayersProps {
  setCopyLayers(copyLayers: any): void;
}

const MenuEditCopyLayers = (props: MenuEditCopyLayersProps): ReactElement => {
  const { setCopyLayers } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Copy',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(copyLayersThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canCopy = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canCopy && !isResizing && !isDragging && !isDrawing;
    }
  }, [canCopy, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setCopyLayers(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditCopyLayers;