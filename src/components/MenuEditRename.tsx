/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEditingThunk } from '../store/actions/leftSidebar';

export const MENU_ITEM_ID = 'editRename';

interface MenuEditRenameProps {
  menu: Electron.Menu;
  setRename(rename: any): void;
}

const MenuEditRename = (props: MenuEditRenameProps): ReactElement => {
  const { menu, setRename } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Rename Layer',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(setEditingThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canRename = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.leftSidebar.editing !== state.layer.present.selected[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    setRename(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canRename && !isResizing && !isDragging && !isDrawing;
    }
  }, [canRename, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditRename;