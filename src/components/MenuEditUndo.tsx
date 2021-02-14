/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { undoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editUndo';

interface MenuEditUndoProps {
  setUndo(undo: any): void;
}

const MenuEditUndo = (props: MenuEditUndoProps): ReactElement => {
  const { setUndo } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Undo',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Z' : 'Ctrl+Z',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(undoThunk());
    }
  })
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canUndo = useSelector((state: RootState) => state.layer.past.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canUndo && !isResizing && !isDragging && !isDrawing;
    }
  }, [canUndo, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setUndo(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditUndo;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { undoThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editUndo';

// const MenuEditUndo = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canUndo = useSelector((state: RootState) => state.layer.past.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canUndo && !isResizing && !isDragging && !isDrawing;
//   }, [canUndo, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(undoThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditUndo,
//   MENU_ITEM_ID
// );