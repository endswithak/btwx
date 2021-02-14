/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCut';

interface MenuEditCutProps {
  menu: Electron.Menu;
  setCut(cut: any): void;
}

const MenuEditCut = (props: MenuEditCutProps): ReactElement => {
  const { menu, setCut } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Cut',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(removeLayersThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const canCut = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setCut(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canCut;
    }
  }, [canCut]);

  return (
    <></>
  );
}

export default MenuEditCut;