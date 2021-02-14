/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedRight } from '../store/selectors/layer';
import { alignSelectedToRightThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignRight';

interface MenuArrangeAlignRightProps {
  menu: Electron.Menu;
  setRight(right: any): void;
}

const MenuArrangeAlignRight = (props: MenuArrangeAlignRightProps): ReactElement => {
  const { menu, setRight } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Right',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(alignSelectedToRightThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedRight(state) === 'multi'));
  const dispatch = useDispatch();

  useEffect(() => {
    setRight(menuItemTemplate);
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

  return (
    <></>
  );
}

export default MenuArrangeAlignRight;