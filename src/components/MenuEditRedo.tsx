/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { redoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editRedo';

interface MenuEditRedoProps {
  setRedo(redo: any): void;
}

const MenuEditRedo = (props: MenuEditRedoProps): ReactElement => {
  const { setRedo } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Redo',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(redoThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canRedo = useSelector((state: RootState) => state.layer.future.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canRedo && !isResizing && !isDragging && !isDrawing;
    }
  }, [canRedo, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setRedo(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditRedo;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { redoThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editRedo';

// const MenuEditRedo = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canRedo = useSelector((state: RootState) => state.layer.future.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canRedo && !isResizing && !isDragging && !isDrawing;
//   }, [canRedo, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(redoThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditRedo,
//   MENU_ITEM_ID
// );