/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteSVGThunk } from '../store/actions/layer';
import { canPasteSVG } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editPasteSVG';

interface MenuEditPasteSVGProps {
  menu: Electron.Menu;
  setPasteSVG(pasteSVG: any): void;
}

const MenuEditPasteSVG = (props: MenuEditPasteSVGProps): ReactElement => {
  const { menu, setPasteSVG } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Paste SVG Code',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteSVGThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const canPaste = useSelector((state: RootState) => canPasteSVG() && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setPasteSVG(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canPaste;
    }
  }, [canPaste]);

  return (
    <></>
  );
}

export default MenuEditPasteSVG;