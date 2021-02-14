/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllArtboardsThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAllArtboards';

interface MenuEditSelectAllArtboardsProps {
  setSelectAllArtboards(selectAllArtboards: any): void;
}

const MenuEditSelectAllArtboards = (props: MenuEditSelectAllArtboardsProps): ReactElement => {
  const { setSelectAllArtboards } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Select All Artboards',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+A' : 'Ctrl+Shift+A',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(selectAllArtboardsThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSelectAllArtboards = useSelector((state: RootState) => state.layer.present.allArtboardIds.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canSelectAllArtboards && !isResizing && !isDragging && !isDrawing;
    }
  }, [canSelectAllArtboards, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setSelectAllArtboards(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditSelectAllArtboards;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { selectAllArtboardsThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editSelectAllArtboards';

// const MenuEditSelectAllArtboards = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canSelectAllArtboards = useSelector((state: RootState) => state.layer.present.allArtboardIds.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canSelectAllArtboards && !isResizing && !isDragging && !isDrawing;
//   }, [canSelectAllArtboards, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(selectAllArtboardsThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditSelectAllArtboards,
//   MENU_ITEM_ID
// );