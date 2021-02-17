/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';

export const MENU_ITEM_ID = 'insertArtboard';

interface MenuInsertArtboardProps {
  menu: Electron.Menu;
  setArtboard(artboard: any): void;
}

const MenuInsertArtboard = (props: MenuInsertArtboardProps): ReactElement => {
  const { menu, setArtboard } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.insert.artboard);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    state.canvasSettings.activeTool === 'Artboard'
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Artboard',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isChecked,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleArtboardToolThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setArtboard(menuItemTemplate);
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

export default MenuInsertArtboard;