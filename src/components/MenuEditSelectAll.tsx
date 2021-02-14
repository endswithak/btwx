/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllLayers } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAll';

interface MenuEditSelectAllProps {
  menu: Electron.Menu;
  setSelectAll(selectAll: any): void;
}

const MenuEditSelectAll = (props: MenuEditSelectAllProps): ReactElement => {
  const { menu, setSelectAll } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Select All',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+A' : 'Ctrl+A',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(selectAllLayers());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSelectAll = useSelector((state: RootState) => state.layer.present.allIds.length > 1 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectAll(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canSelectAll && !isResizing && !isDragging && !isDrawing;
    }
  }, [canSelectAll, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditSelectAll;