/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copySVGThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopySVG';

interface MenuEditCopySVGProps {
  setCopySVG(copySVG: any): void;
}

const MenuEditCopySVG = (props: MenuEditCopySVGProps): ReactElement => {
  const { setCopySVG } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Copy SVG Code',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(copySVGThunk());
    }
  });
  const canCopy = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canCopy;
    }
  }, [canCopy]);

  useEffect(() => {
    setCopySVG(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditCopySVG;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { copySVGThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editCopySVG';

// const MenuEditCopySVG = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const canCopy = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canCopy;
//   }, [canCopy]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(copySVGThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditCopySVG,
//   MENU_ITEM_ID
// );