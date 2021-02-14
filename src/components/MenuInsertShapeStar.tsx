/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeStar';

interface MenuInsertShapeStarProps {
  menu: Electron.Menu;
  setStar(star: any): void;
}

const MenuInsertShapeStar = (props: MenuInsertShapeStarProps): ReactElement => {
  const { menu, setStar } = props;
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.activeArtboard !== null &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    state.canvasSettings.activeTool === 'Shape' &&
    state.shapeTool.shapeType === 'Star'
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Star',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: isChecked,
    enabled: isEnabled,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Star'));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setStar(menuItemTemplate);
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

export default MenuInsertShapeStar;