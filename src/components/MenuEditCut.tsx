/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCut';

interface MenuEditCutProps {
  setCut(cut: any): void;
}

const MenuEditCut = (props: MenuEditCutProps): ReactElement => {
  const { setCut } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Cut',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(removeLayersThunk());
    }
  });
  const canCut = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canCut;
    }
  }, [canCut]);

  useEffect(() => {
    setCut(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditCut;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { removeLayersThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editCut';

// const MenuEditCut = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const canCut = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canCut;
//   }, [canCut]);

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
//   MenuEditCut,
//   MENU_ITEM_ID
// );