/* eslint-disable @typescript-eslint/no-use-before-define */
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
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.mask.ignoreUnderlyingMask);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const isChecked = useSelector((state: RootState) =>
    selectedIgnoreUnderlyingMaskEnabled(state)
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Ignore Underlying Mask',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    type: 'checkbox',
    checked: isChecked,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectionIgnoreUnderlyingMask());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
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

export default MenuLayerMaskToggleUnderlyingMask;