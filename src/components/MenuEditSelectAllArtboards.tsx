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
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Select All Artboards',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+A' : 'Ctrl+Shift+A',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(selectAllArtboardsThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSelectAllArtboards = useSelector((state: RootState) => state.layer.present.allArtboardIds.length > 0 && state.canvasSettings.focusing);
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
      menuItem.enabled = canSelectAllArtboards && !isResizing && !isDragging && !isDrawing;
    }
  }, [canSelectAllArtboards, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditSelectAllArtboards;