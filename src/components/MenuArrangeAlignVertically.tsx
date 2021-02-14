/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedMiddle } from '../store/selectors/layer';
import { alignSelectedToMiddleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignVertically';

interface MenuArrangeAlignVerticallyProps {
  menu: Electron.Menu;
  setMiddle(middle: any): void;
}

const MenuArrangeAlignVertically = (props: MenuArrangeAlignVerticallyProps): ReactElement => {
  const { menu, setMiddle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Vertically',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(alignSelectedToMiddleThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedMiddle(state) === 'multi'));
  const dispatch = useDispatch();

  useEffect(() => {
    setMiddle(menuItemTemplate);
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

export default MenuArrangeAlignVertically;