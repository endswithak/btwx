/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeRounded';

interface MenuInsertShapeRoundedProps {
  menu: Electron.Menu;
  setRounded(rounded: any): void;
}

const MenuInsertShapeRounded = (props: MenuInsertShapeRoundedProps): ReactElement => {
  const { menu, setRounded } = props;
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    state.canvasSettings.activeTool === 'Shape' &&
    state.shapeTool.shapeType === 'Rounded'
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Rounded',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isChecked,
    enabled: isEnabled,
    accelerator: 'U',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Rounded'));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setRounded(menuItemTemplate);
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

export default MenuInsertShapeRounded;