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
  const isEnabled = useSelector((state: RootState) =>
    canToggleSelectedUseAsMask(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    selectedUseAsMaskEnabled(state)
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Use As Mask',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+M' : 'Ctrl+M',
    type: 'checkbox',
    checked: isChecked,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectedMaskThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
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
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isChecked;
    }
  }, [isChecked]);

  return (
    <></>
  );
}

export default MenuLayerMaskUseAsMask;