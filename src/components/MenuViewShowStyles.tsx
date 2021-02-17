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
  const accelerator = useSelector((state: RootState) => state.keyBindings.view.showStyles);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Show Events',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isChecked,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleRightSidebarThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

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

export default MenuViewShowStyles;