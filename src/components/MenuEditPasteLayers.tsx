/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPaste';

interface MenuEditPasteLayersProps {
  menu: Electron.Menu;
  setPasteLayers(pasteLayers: any): void;
}

const MenuEditPasteLayers = (props: MenuEditPasteLayersProps): ReactElement => {
  const { menu, setPasteLayers } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Paste',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+V' : 'Ctrl+V',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteLayersThunk({}));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canPaste = useSelector((state: RootState) => state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setPasteLayers(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canPaste && !isResizing && !isDragging && !isDrawing;
    }
  }, [canPaste, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditPasteLayers;