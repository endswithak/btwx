/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleRightSidebarThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowStyles';

interface MenuViewShowStylesProps {
  menu: Electron.Menu;
  setShowStyles(showStyles: any): void;
}

const MenuViewShowStyles = (props: MenuViewShowStylesProps): ReactElement => {
  const { menu, setShowStyles } = props;
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isOpen = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const dispatch = useDispatch();

  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Show Events',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isOpen,
    enabled: !isResizing && !isDragging && !isDrawing,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+3' : 'Ctrl+Alt+3',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleRightSidebarThunk());
    }
  });

  useEffect(() => {
    setShowStyles(menuItemTemplate);
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

export default MenuViewShowStyles;