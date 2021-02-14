/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeRounded';

interface MenuInsertShapeRoundedProps {
  setRounded(rounded: any): void;
}

const MenuInsertShapeRounded = (props: MenuInsertShapeRoundedProps): ReactElement => {
  const { setRounded } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Rounded',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    accelerator: 'U',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Rounded'));
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingRounded = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rounded');
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
      appMenuItem.checked = insertingRounded;
    }
  }, [insertingRounded]);

  useEffect(() => {
    setRounded(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertShapeRounded;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { toggleShapeToolThunk } from '../store/actions/shapeTool';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertShapeRounded';

// const MenuInsertShapeRounded = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const insertingRounded = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rounded');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing && !isSelecting;
//   }, [canInsert, isDragging, isResizing, isDrawing, isSelecting]);

//   useEffect(() => {
//     menuItem.checked = insertingRounded;
//   }, [insertingRounded]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(toggleShapeToolThunk('Rounded'));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertShapeRounded,
//   MENU_ITEM_ID
// );