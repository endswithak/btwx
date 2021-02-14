/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedFillThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedFillEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleFill';

interface MenuLayerStyleFillProps {
  menu: Electron.Menu;
  setFill(fill: any): void;
}

const MenuLayerStyleFill = (props: MenuLayerStyleFillProps): ReactElement => {
  const { menu, setFill } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Fill',
    id: MENU_ITEM_ID,
    enabled: false,
    type: 'checkbox',
    checked: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectedFillThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isEnabled = useSelector((state: RootState) => canToggleSelectedFillOrStroke(state));
  const isChecked = useSelector((state: RootState) => selectedFillEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setFill(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isChecked;
    }
  }, [isChecked]);

  return (
    <></>
  );
}

export default MenuLayerStyleFill;