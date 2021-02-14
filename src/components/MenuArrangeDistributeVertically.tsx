/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedVerticallyThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeDistributeVertically';

interface MenuArrangeDistributeVerticallyProps {
  menu: Electron.Menu;
  setVertical(vertical: any): void;
}

const MenuArrangeDistributeVertically = (props: MenuArrangeDistributeVerticallyProps): ReactElement => {
  const { menu, setVertical } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Vertically',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Ctrl+Cmd+V' : 'Ctrl+Shift+V',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(distributeSelectedVerticallyThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canDistribute = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 3);
  const dispatch = useDispatch();

  useEffect(() => {
    setVertical(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canDistribute && !isResizing && !isDragging && !isDrawing;
    }
  }, [canDistribute, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuArrangeDistributeVertically;