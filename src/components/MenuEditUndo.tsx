/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { undoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editUndo';

interface MenuEditUndoProps {
  menu: Electron.Menu;
  setUndo(undo: any): void;
}

const MenuEditUndo = (props: MenuEditUndoProps): ReactElement => {
  const { menu, setUndo } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Undo',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Z' : 'Ctrl+Z',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(undoThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canUndo = useSelector((state: RootState) => state.layer.past.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setUndo(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canUndo && !isResizing && !isDragging && !isDrawing;
    }
  }, [canUndo, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditUndo;