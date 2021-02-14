/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteStyleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPasteStyle';

interface MenuEditPasteStyleProps {
  menu: Electron.Menu;
  setPasteStyle(pasteStyle: any): void;
}

const MenuEditPasteStyle = (props: MenuEditPasteStyleProps): ReactElement => {
  const { menu, setPasteStyle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Paste Style',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+V' : 'Ctrl+Alt+V',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteStyleThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canPasteStyle = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setPasteStyle(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canPasteStyle && !isResizing && !isDragging && !isDrawing;
    }
  }, [canPasteStyle, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditPasteStyle;