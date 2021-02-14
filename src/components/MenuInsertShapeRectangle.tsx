/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeRectangle';

interface MenuInsertShapeRectangleProps {
  setRectangle(rectangle: any): void;
}

const MenuInsertShapeRectangle = (props: MenuInsertShapeRectangleProps): ReactElement => {
  const { setRectangle } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Rectangle',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    accelerator: 'R',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Rectangle'));
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingRectangle = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rectangle');
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing;
    }
  }, [canInsert, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.checked = insertingRectangle;
    }
  }, [insertingRectangle]);

  useEffect(() => {
    setRectangle(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertShapeRectangle;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { toggleShapeToolThunk } from '../store/actions/shapeTool';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertShapeRectangle';

// const MenuInsertShapeRectangle = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const insertingRectangle = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rectangle');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing;
//   }, [canInsert, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     menuItem.checked = insertingRectangle;
//   }, [insertingRectangle]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(toggleShapeToolThunk('Rectangle'));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertShapeRectangle,
//   MENU_ITEM_ID
// );