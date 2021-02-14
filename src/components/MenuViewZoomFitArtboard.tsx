/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitArtboard';

interface MenuViewZoomFitArtboardProps {
  menu: Electron.Menu;
  setFitArtboard(fitArtboard: any): void;
}

const MenuViewZoomFitArtboard = (props: MenuViewZoomFitArtboardProps): ReactElement => {
  const { menu, setFitArtboard } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Fit Active Artboard',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+4' : 'Ctrl+4',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(zoomFitActiveArtboardThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canZoom = useSelector((state: RootState) => state.layer.present.activeArtboard !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    setFitArtboard(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canZoom && !isResizing && !isDragging && !isDrawing;
    }
  }, [canZoom, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuViewZoomFitArtboard;