/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { centerSelectedThunk } from '../store/actions/translateTool';

export const MENU_ITEM_ID = 'viewCenterSelected';

interface MenuViewCenterSelectedProps {
  menu: Electron.Menu;
  setCenter(center: any): void;
}

const MenuViewCenterSelected = (props: MenuViewCenterSelectedProps): ReactElement => {
  const { menu, setCenter } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Center Selection',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+3' : 'Ctrl+3',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(centerSelectedThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canCenter = useSelector((state: RootState) => state.layer.present.selected.length > 0);
  const dispatch = useDispatch();

  useEffect(() => {
    setCenter(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canCenter && !isResizing && !isDragging && !isDrawing;
    }
  }, [canCenter, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuViewCenterSelected;