/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copyStyleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopyStyle';

interface MenuEditCopyStyleProps {
  menu: Electron.Menu;
  setCopyStyle(copyStyle: any): void;
}

const MenuEditCopyStyle = (props: MenuEditCopyStyleProps): ReactElement => {
  const { menu, setCopyStyle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Copy Style',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+C' : 'Ctrl+Alt+C',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(copyStyleThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canCopy = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setCopyStyle(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canCopy && !isResizing && !isDragging && !isDrawing
    }
  }, [canCopy, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditCopyStyle;