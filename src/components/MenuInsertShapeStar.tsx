/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeStar';

interface MenuInsertShapeStarProps {
  setStar(star: any): void;
}

const MenuInsertShapeStar = (props: MenuInsertShapeStarProps): ReactElement => {
  const { setStar } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Star',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Star'));
    }
  });
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Star');
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canInsert;
    }
  }, [canInsert]);

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.checked = isChecked;
    }
  }, [isChecked]);

  useEffect(() => {
    setStar(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertShapeStar;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { toggleShapeToolThunk } from '../store/actions/shapeTool';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertShapeStar';

// const MenuInsertShapeStar = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Star');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert;
//   }, [canInsert]);

//   useEffect(() => {
//     menuItem.checked = isChecked;
//   }, [isChecked]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(toggleShapeToolThunk('Star'));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertShapeStar,
//   MENU_ITEM_ID
// );