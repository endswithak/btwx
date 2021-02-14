/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editDelete';

interface MenuEditDeleteProps {
  menu: Electron.Menu;
  setDeleteLayers(deleteLayers: any): void;
}

const MenuEditDelete = (props: MenuEditDeleteProps): ReactElement => {
  const { menu, setDeleteLayers } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Delete',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: 'Backspace',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(removeLayersThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canDelete = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setDeleteLayers(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canDelete && !isResizing && !isDragging && !isDrawing;
    }
  }, [canDelete, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditDelete;