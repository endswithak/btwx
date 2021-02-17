/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEditingThunk } from '../store/actions/leftSidebar';

export const MENU_ITEM_ID = 'editRename';

interface MenuEditRenameProps {
  menu: Electron.Menu;
  setRename(rename: any): void;
}

const MenuEditRename = (props: MenuEditRenameProps): ReactElement => {
  const { menu, setRename } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.rename);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length === 1 &&
    state.leftSidebar.editing !== state.layer.present.selected[0] &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Rename Layer',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(setEditingThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setRename(menuItemTemplate);
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

export default MenuEditRename;