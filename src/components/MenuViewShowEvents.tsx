/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleEventDrawerThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowEvents';

interface MenuViewShowEventsProps {
  menu: Electron.Menu;
  setShowEvents(showEvents: any): void;
}

const MenuViewShowEvents = (props: MenuViewShowEventsProps): ReactElement => {
  const { menu, setShowEvents } = props;
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isOpen = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen);
  const dispatch = useDispatch();

  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Show Styles',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isOpen,
    enabled: !isResizing && !isDragging && !isDrawing,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+2' : 'Ctrl+Alt+2',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleEventDrawerThunk());
    }
  });

  useEffect(() => {
    setShowEvents(menuItemTemplate);
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

export default MenuViewShowEvents;