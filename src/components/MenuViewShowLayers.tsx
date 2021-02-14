/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowLayers';

interface MenuViewShowLayersProps {
  menu: Electron.Menu;
  setShowLayers(showLayers: any): void;
}

const MenuViewShowLayers = (props: MenuViewShowLayersProps): ReactElement => {
  const { menu, setShowLayers } = props;
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isOpen = useSelector((state: RootState) => state.viewSettings.leftSidebar.isOpen);
  const dispatch = useDispatch();

  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Show Layers',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isOpen,
    enabled: !isResizing && !isDragging && !isDrawing,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+1' : 'Ctrl+Alt+1',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleLeftSidebarThunk());
    }
  });

  useEffect(() => {
    setShowLayers(menuItemTemplate);
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

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isOpen;
    }
  }, [isOpen]);

  return (
    <></>
  );
}

export default MenuViewShowLayers;