/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapePolygon';

interface MenuInsertShapePolygonProps {
  menu: Electron.Menu;
  setPolygon(polygon: any): void;
}

const MenuInsertShapePolygon = (props: MenuInsertShapePolygonProps): ReactElement => {
  const { menu, setPolygon } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Polygon',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Polygon'));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Polygon');
  const dispatch = useDispatch();

  useEffect(() => {
    setPolygon(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canInsert;
    }
  }, [canInsert]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isChecked;
    }
  }, [isChecked]);

  return (
    <></>
  );
}

export default MenuInsertShapePolygon;