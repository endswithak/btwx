/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteSVGThunk } from '../store/actions/layer';
import { canPasteSVG } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editPasteSVG';

interface MenuEditPasteSVGProps {
  setPasteSVG(pasteSVG: any): void;
}

const MenuEditPasteSVG = (props: MenuEditPasteSVGProps): ReactElement => {
  const { setPasteSVG } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Paste SVG Code',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteSVGThunk());
    }
  });
  const canPaste = useSelector((state: RootState) => canPasteSVG() && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canPaste;
    }
  }, [canPaste]);

  useEffect(() => {
    setPasteSVG(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditPasteSVG;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { pasteSVGThunk } from '../store/actions/layer';
// import { canPasteSVG } from '../store/selectors/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editPasteSVG';

// const MenuEditPasteSVG = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const canPaste = useSelector((state: RootState) => canPasteSVG() && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canPaste;
//   }, [canPaste]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(pasteSVGThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditPasteSVG,
//   MENU_ITEM_ID
// );