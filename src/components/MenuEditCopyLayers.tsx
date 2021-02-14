/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copyLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopy';

interface MenuEditCopyLayersProps {
  menu: Electron.Menu;
  setCopyLayers(copyLayers: any): void;
}

const MenuEditCopyLayers = (props: MenuEditCopyLayersProps): ReactElement => {
  const { menu, setCopyLayers } = props;
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Copy',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(copyLayersThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setCopyLayers(menuItemTemplate);
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

export default MenuEditCopyLayers;