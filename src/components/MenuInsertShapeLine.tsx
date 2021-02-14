/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeLine';

interface MenuInsertShapeLineProps {
  setLine(line: any): void;
}

const MenuInsertShapeLine = (props: MenuInsertShapeLineProps): ReactElement => {
  const { setLine } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Line',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    accelerator: 'L',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Line'));
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingLine = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Line');
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
      appMenuItem.checked = insertingLine;
    }
  }, [insertingLine]);

  useEffect(() => {
    setLine(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertShapeLine;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { toggleShapeToolThunk } from '../store/actions/shapeTool';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertShapeLine';

// const MenuInsertShapeLine = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const insertingLine = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Line');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing && !isSelecting;
//   }, [canInsert, isDragging, isResizing, isDrawing, isSelecting]);

//   useEffect(() => {
//     menuItem.checked = insertingLine;
//   }, [insertingLine]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(toggleShapeToolThunk('Line'));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertShapeLine,
//   MENU_ITEM_ID
// );