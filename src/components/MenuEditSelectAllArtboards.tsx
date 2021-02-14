/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllArtboardsThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAllArtboards';

interface MenuEditSelectAllArtboardsProps {
  menu: Electron.Menu;
  setSelectAllArtboards(selectAllArtboards: any): void;
}

const MenuEditSelectAllArtboards = (props: MenuEditSelectAllArtboardsProps): ReactElement => {
  const { menu, setSelectAllArtboards } = props;
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.allArtboardIds.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Select All Artboards',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+A' : 'Ctrl+Shift+A',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(selectAllArtboardsThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectAllArtboards(menuItemTemplate);
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

export default MenuEditSelectAllArtboards;