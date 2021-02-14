/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeEllipse';

interface MenuInsertShapeEllipseProps {
  setEllipse(ellipse: any): void;
}

const MenuInsertShapeEllipse = (props: MenuInsertShapeEllipseProps): ReactElement => {
  const { setEllipse } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Ellipse',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    accelerator: 'O',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Ellipse'));
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingEllipse = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Ellipse');
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
      appMenuItem.checked = insertingEllipse;
    }
  }, [insertingEllipse]);

  useEffect(() => {
    setEllipse(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertShapeEllipse;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { toggleShapeToolThunk } from '../store/actions/shapeTool';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertShapeEllipse';

// const MenuInsertShapeEllipse = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const insertingEllipse = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Ellipse');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing && !isSelecting;
//   }, [canInsert, isDragging, isResizing, isDrawing, isSelecting]);

//   useEffect(() => {
//     menuItem.checked = insertingEllipse;
//   }, [insertingEllipse]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(toggleShapeToolThunk('Ellipse'));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertShapeEllipse,
//   MENU_ITEM_ID
// );