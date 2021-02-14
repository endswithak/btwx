/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEditingThunk } from '../store/actions/leftSidebar';

export const MENU_ITEM_ID = 'editRename';

interface MenuEditRenameProps {
  setRename(rename: any): void;
}

const MenuEditRename = (props: MenuEditRenameProps): ReactElement => {
  const { setRename } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Rename Layer',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(setEditingThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canRename = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.leftSidebar.editing !== state.layer.present.selected[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canRename && !isResizing && !isDragging && !isDrawing;
    }
  }, [canRename, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setRename(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditRename;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { setEditingThunk } from '../store/actions/leftSidebar';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editRename';

// const MenuEditRename = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canRename = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.leftSidebar.editing !== state.layer.present.selected[0]);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canRename && !isResizing && !isDragging && !isDrawing;
//   }, [canRename, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(setEditingThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditRename,
//   MENU_ITEM_ID
// );