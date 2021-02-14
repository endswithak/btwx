/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPaste';

interface MenuEditPasteLayersProps {
  setPasteLayers(pasteLayers: any): void;
}

const MenuEditPasteLayers = (props: MenuEditPasteLayersProps): ReactElement => {
  const { setPasteLayers } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Paste',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+V' : 'Ctrl+V',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteLayersThunk({}));
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canPaste = useSelector((state: RootState) => state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canPaste && !isResizing && !isDragging && !isDrawing;
    }
  }, [canPaste, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setPasteLayers(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditPasteLayers;