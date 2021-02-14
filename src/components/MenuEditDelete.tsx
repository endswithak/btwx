/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editDelete';

interface MenuEditDeleteProps {
  setDeleteLayers(deleteLayers: any): void;
}

const MenuEditDelete = (props: MenuEditDeleteProps): ReactElement => {
  const { setDeleteLayers } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Delete',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: 'Backspace',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(removeLayersThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canDelete = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canDelete && !isResizing && !isDragging && !isDrawing;
    }
  }, [canDelete, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setDeleteLayers(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditDelete;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { removeLayersThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editDelete';

// const MenuEditDelete = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canDelete = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canDelete && !isResizing && !isDragging && !isDrawing;
//   }, [canDelete, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(removeLayersThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditDelete,
//   MENU_ITEM_ID
// );