/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copyLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopy';

interface MenuEditCopyLayersProps {
  menu: Electron.Menu;
  setCopyLayers(copyLayers: any): void;
}

const MenuEditCopyLayers = (props: MenuEditCopyLayersProps): ReactElement => {
  const { menu, setCopyLayers } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Copy',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(copyLayersThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canCopy = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setCopyLayers(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canCopy && !isResizing && !isDragging && !isDrawing;
    }
  }, [canCopy, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditCopyLayers;