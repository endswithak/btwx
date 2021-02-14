/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedCenter } from '../store/selectors/layer';
import { alignSelectedToCenterThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignHorizontally';

interface MenuArrangeAlignHorizontallyProps {
  menu: Electron.Menu;
  setCenter(center: any): void;
}

const MenuArrangeAlignHorizontally = (props: MenuArrangeAlignHorizontallyProps): ReactElement => {
  const { menu, setCenter } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Horizontally',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(alignSelectedToCenterThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedCenter(state) === 'multi'));
  const dispatch = useDispatch();

  useEffect(() => {
    setCenter(menuItemTemplate);
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

export default MenuArrangeAlignHorizontally;