/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';

export const MENU_ITEM_ID = 'insertShapeRectangle';

interface MenuInsertShapeRectangleProps {
  menu: Electron.Menu;
  setRectangle(rectangle: any): void;
}

const MenuInsertShapeRectangle = (props: MenuInsertShapeRectangleProps): ReactElement => {
  const { menu, setRectangle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Rectangle',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    accelerator: 'R',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleShapeToolThunk('Rectangle'));
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingRectangle = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rectangle');
  const dispatch = useDispatch();

  useEffect(() => {
    setRectangle(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing;
    }
  }, [canInsert, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = insertingRectangle;
    }
  }, [insertingRectangle]);

  return (
    <></>
  );
}

export default MenuInsertShapeRectangle;