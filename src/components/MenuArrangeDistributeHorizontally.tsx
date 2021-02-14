/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedHorizontallyThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeDistributeHorizontally';

interface MenuArrangeDistributeHorizontallyProps {
  menu: Electron.Menu;
  setHorizontal(horizontal: any): void;
}

const MenuArrangeDistributeHorizontally = (props: MenuArrangeDistributeHorizontallyProps): ReactElement => {
  const { menu, setHorizontal } = props;
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 3 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Horizontally',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator: remote.process.platform === 'darwin' ? 'Ctrl+Cmd+H' : 'Ctrl+Shift+H',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(distributeSelectedHorizontallyThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setHorizontal(menuItemTemplate);
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

export default MenuArrangeDistributeHorizontally;