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
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.showEvents);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen);
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Show Styles',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isChecked,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleEventDrawerThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

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
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isChecked;
    }
  }, [isChecked]);

  return (
    <></>
  );
}

export default MenuViewShowEvents;