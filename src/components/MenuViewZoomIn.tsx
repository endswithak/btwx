/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'viewZoomIn';

interface MenuViewZoomInProps {
  menu: Electron.Menu;
  setZoomIn(zoomIn: any): void;
}

const MenuViewZoomIn = (props: MenuViewZoomInProps): ReactElement => {
  const { menu, setZoomIn } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Zoom In',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Plus' : 'Ctrl+Plus',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(zoomInThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    setZoomIn(menuItemTemplate);
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

export default MenuViewZoomIn;