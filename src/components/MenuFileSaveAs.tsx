/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveDocumentAsThunk } from '../store/actions/documentSettings';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileSaveAs';

interface MenuFileSaveAsProps {
  menu: Electron.Menu;
  setSaveAs(saveAs: any): void;
}

const MenuFileSaveAs = (props: MenuFileSaveAsProps): ReactElement => {
  const { menu, setSaveAs } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Save As...',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(saveDocumentAsThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    setSaveAs(menuItemTemplate);
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

  return (
    <></>
  );
}

export default MenuFileSaveAs;