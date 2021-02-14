/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomOutThunk } from '../store/actions/zoomTool';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'viewZoomOut';

interface MenuViewZoomOutProps {
  menu: Electron.Menu;
  setZoomOut(zoomOut: any): void;
}

const MenuViewZoomOut = (props: MenuViewZoomOutProps): ReactElement => {
  const { menu, setZoomOut } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Zoom Out',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+-' : 'Ctrl+-',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(zoomOutThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    setZoomOut(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = !isResizing && !isDragging && !isDrawing;
    }
  }, [isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuViewZoomOut;