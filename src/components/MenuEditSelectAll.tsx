/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllLayers } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAll';

interface MenuEditSelectAllProps {
  setSelectAll(selectAll: any): void;
}

const MenuEditSelectAll = (props: MenuEditSelectAllProps): ReactElement => {
  const { setSelectAll } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Select All',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+A' : 'Ctrl+A',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(selectAllLayers());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSelectAll = useSelector((state: RootState) => state.layer.present.allIds.length > 1 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canSelectAll && !isResizing && !isDragging && !isDrawing;
    }
  }, [canSelectAll, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setSelectAll(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditSelectAll;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { selectAllLayers } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editSelectAll';

// const MenuEditSelectAll = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canSelectAll = useSelector((state: RootState) => state.layer.present.allIds.length > 1 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canSelectAll && !isResizing && !isDragging && !isDrawing;
//   }, [canSelectAll, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(selectAllLayers());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditSelectAll,
//   MENU_ITEM_ID
// );