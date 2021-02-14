/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';

export const MENU_ITEM_ID = 'insertArtboard';

interface MenuInsertArtboardProps {
  menu: Electron.Menu;
  setArtboard(artboard: any): void;
}

const MenuInsertArtboard = (props: MenuInsertArtboardProps): ReactElement => {
  const { menu, setArtboard } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Artboard',
    id: MENU_ITEM_ID,
    type: 'checkbox',
    checked: false,
    enabled: false,
    accelerator: 'A',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleArtboardToolThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const isFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Artboard');
  const dispatch = useDispatch();

  useEffect(() => {
    setArtboard(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = isFocusing && !isResizing && !isDragging && !isDrawing && !isSelecting;
    }
  }, [isFocusing, isDragging, isResizing, isDrawing, isSelecting]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isChecked;
    }
  }, [isChecked]);

  return (
    <></>
  );
}

export default MenuInsertArtboard;