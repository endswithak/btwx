/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedForwardThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeBringForward';

interface MenuArrangeBringForwardProps {
  menu: Electron.Menu;
  setBringForward(bringForward: any): void;
}

const MenuArrangeBringForward = (props: MenuArrangeBringForwardProps): ReactElement => {
  const { menu, setBringForward } = props;
  const isEnabled = useSelector((state: RootState) =>
    canBringSelectedForward(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Bring Forward',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+]' : 'Ctrl+]',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(bringSelectedForwardThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setBringForward(menuItemTemplate);
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

export default MenuArrangeBringForward;