/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapePolygon';

interface MenuInsertShapePolygonProps {
  setPolygon(polygon: any): void;
}

const MenuInsertShapePolygon = (props: MenuInsertShapePolygonProps): ReactElement => {
  const { setPolygon } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Polygon',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Polygon'));
    }
  });
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Polygon');
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
    setPolygon(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuInsertShapePolygon;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { toggleShapeToolThunk } from '../store/actions/shapeTool';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'insertShapePolygon';

// const MenuInsertShapePolygon = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
//   const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Polygon');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canInsert;
//   }, [canInsert]);

//   useEffect(() => {
//     menuItem.checked = isChecked;
//   }, [isChecked]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(toggleShapeToolThunk('Polygon'));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuInsertShapePolygon,
//   MENU_ITEM_ID
// );