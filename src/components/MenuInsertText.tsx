/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleTextToolThunk } from '../store/actions/textTool';

export const MENU_ITEM_ID = 'insertText';

interface MenuInsertTextProps {
  setText(text: any): void;
}

const MenuInsertText = (props: MenuInsertTextProps): ReactElement => {
  const { setText } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Text',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    accelerator: 'T',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleTextToolThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingText = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Text');
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing && !isSelecting;
    }
  }, [canInsert, isDragging, isResizing, isDrawing, isSelecting]);

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.checked = insertingText;
    }
  }, [insertingText]);

  useEffect(() => {
    setText(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertText;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { toggleTextToolThunk } from '../store/actions/textTool';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertText';

// const MenuInsertText = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const insertingText = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Text');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing && !isSelecting;
//   }, [canInsert, isDragging, isResizing, isDrawing, isSelecting]);

//   useEffect(() => {
//     menuItem.checked = insertingText;
//   }, [insertingText]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(toggleTextToolThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertText,
//   MENU_ITEM_ID
// );