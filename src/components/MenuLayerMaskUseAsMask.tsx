/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedMaskThunk } from '../store/actions/layer';
import { canToggleSelectedUseAsMask, selectedUseAsMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskUseAsMask';

interface MenuLayerMaskUseAsMaskProps {
  menu: Electron.Menu;
  setUseAsMask(useAsMask: any): void;
}

const MenuLayerMaskUseAsMask = (props: MenuLayerMaskUseAsMaskProps): ReactElement => {
  const { menu, setUseAsMask } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Use As Mask',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+M' : 'Ctrl+M',
    type: 'checkbox',
    checked: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectedMaskThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canMask = useSelector((state: RootState) => canToggleSelectedUseAsMask(state));
  const usingAsMask = useSelector((state: RootState) => selectedUseAsMaskEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    setUseAsMask(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canMask && !isResizing && !isDragging && !isDrawing;
    }
  }, [canMask, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = usingAsMask;
    }
  }, [usingAsMask]);

  return (
    <></>
  );
}

export default MenuLayerMaskUseAsMask;