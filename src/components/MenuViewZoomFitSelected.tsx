/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitSelectedThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitSelected';

interface MenuViewZoomFitSelectedProps {
  menu: Electron.Menu;
  setFitSelected(fitSelected: any): void;
}

const MenuViewZoomFitSelected = (props: MenuViewZoomFitSelectedProps): ReactElement => {
  const { menu, setFitSelected } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Fit Selection',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+2' : 'Ctrl+2',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(zoomFitSelectedThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canZoom = useSelector((state: RootState) => state.layer.present.selected.length > 0);
  const dispatch = useDispatch();

  useEffect(() => {
    setFitSelected(menuItemTemplate);
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

export default MenuViewZoomFitSelected;