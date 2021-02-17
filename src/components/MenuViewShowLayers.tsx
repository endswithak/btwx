/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowLayers';

interface MenuViewShowLayersProps {
  menu: Electron.Menu;
  setShowLayers(showLayers: any): void;
}

const MenuViewShowLayers = (props: MenuViewShowLayersProps): ReactElement => {
  const { menu, setShowLayers } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.showLayers);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) => state.viewSettings.leftSidebar.isOpen);
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Show Layers',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isChecked,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleLeftSidebarThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setShowLayers(menuItemTemplate);
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

export default MenuViewShowLayers;