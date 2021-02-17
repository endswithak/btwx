/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeUngroup';

interface MenuArrangeUngroupProps {
  menu: Electron.Menu;
  setUngroup(ungroup: any): void;
}

const MenuArrangeUngroup = (props: MenuArrangeUngroupProps): ReactElement => {
  const { menu, setUngroup } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.ungroup);
  const isEnabled = useSelector((state: RootState) =>
    canUngroupSelected(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Ungroup',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(ungroupSelectedThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setUngroup(menuItemTemplate);
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

export default MenuArrangeUngroup;