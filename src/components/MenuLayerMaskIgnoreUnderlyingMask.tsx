/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectionIgnoreUnderlyingMask } from '../store/actions/layer';
import { selectedIgnoreUnderlyingMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskIgnoreUnderlyingMask';

interface MenuLayerMaskToggleUnderlyingMaskProps {
  menu: Electron.Menu;
  setIgnore(ignore: any): void;
}

const MenuLayerMaskToggleUnderlyingMask = (props: MenuLayerMaskToggleUnderlyingMaskProps): ReactElement => {
  const { menu, setIgnore } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Ignore Underlying Mask',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+M' : 'Ctrl+Shift+M',
    type: 'checkbox',
    checked: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectionIgnoreUnderlyingMask());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const ignoringUnderlyingMask = useSelector((state: RootState) => selectedIgnoreUnderlyingMaskEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setIgnore(menuItemTemplate);
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

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = ignoringUnderlyingMask;
    }
  }, [ignoringUnderlyingMask]);

  return (
    <></>
  );
}

export default MenuLayerMaskToggleUnderlyingMask;