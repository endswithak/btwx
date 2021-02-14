/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBottom } from '../store/selectors/layer';
import { alignSelectedToBottomThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignBottom';

interface MenuArrangeAlignBottomProps {
  menu: Electron.Menu;
  setBottom(bottom: any): void;
}

const MenuArrangeAlignBottom = (props: MenuArrangeAlignBottomProps): ReactElement => {
  const { menu, setBottom } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Bottom',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(alignSelectedToBottomThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedBottom(state) === 'multi'));
  const dispatch = useDispatch();

  useEffect(() => {
    setBottom(menuItemTemplate);
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

export default MenuArrangeAlignBottom;