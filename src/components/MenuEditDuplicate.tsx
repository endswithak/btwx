/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { duplicateSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editDuplicate';

interface MenuEditDuplicateProps {
  menu: Electron.Menu;
  setDuplicate(duplicate: any): void;
}

const MenuEditDuplicate = (props: MenuEditDuplicateProps): ReactElement => {
  const { menu, setDuplicate } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Duplicate',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+D' : 'Ctrl+D',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(duplicateSelectedThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canDuplicate = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    setDuplicate(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canDuplicate && !isResizing && !isDragging && !isDrawing;
    }
  }, [canDuplicate, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditDuplicate;