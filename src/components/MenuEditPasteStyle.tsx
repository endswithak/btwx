/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteStyleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPasteStyle';

interface MenuEditPasteStyleProps {
  setPasteStyle(pasteStyle: any): void;
}

const MenuEditPasteStyle = (props: MenuEditPasteStyleProps): ReactElement => {
  const { setPasteStyle } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Paste Style',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+V' : 'Ctrl+Alt+V',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteStyleThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canPasteStyle = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canPasteStyle && !isResizing && !isDragging && !isDrawing;
    }
  }, [canPasteStyle, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setPasteStyle(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditPasteStyle;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { pasteStyleThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editPasteStyle';

// const MenuEditPasteStyle = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canPasteStyle = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canPasteStyle && !isResizing && !isDragging && !isDrawing;
//   }, [canPasteStyle, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(pasteStyleThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditPasteStyle,
//   MENU_ITEM_ID
// );