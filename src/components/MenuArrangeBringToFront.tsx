/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedToFrontThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeBringToFront';

interface MenuArrangeBringToFrontProps {
  menu: Electron.Menu;
  setBringToFront(bringToFront: any): void;
}

const MenuArrangeBringToFront = (props: MenuArrangeBringToFrontProps): ReactElement => {
  const { menu, setBringToFront } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.bringToFront);
  const isEnabled = useSelector((state: RootState) =>
    canBringSelectedForward(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Bring To Front',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(bringSelectedToFrontThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setBringToFront(menuItemTemplate);
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

export default MenuArrangeBringToFront;