/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomFitCanvasThunk } from '../store/actions/zoomTool';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'viewZoomFitCanvas';

interface MenuViewZoomFitCanvasProps {
  menu: Electron.Menu;
  setFitCanvas(fitCanvas: any): void;
}

const MenuViewZoomFitCanvas = (props: MenuViewZoomFitCanvasProps): ReactElement => {
  const { menu, setFitCanvas } = props;
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Fit Canvas',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+1' : 'Ctrl+1',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(zoomFitCanvasThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setFitCanvas(menuItemTemplate);
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

export default MenuViewZoomFitCanvas;