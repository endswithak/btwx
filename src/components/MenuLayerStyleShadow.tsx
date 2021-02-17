/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedShadowThunk } from '../store/actions/layer';
import { canToggleSelectedShadow, selectedShadowEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleShadow';

interface MenuLayerStyleShadowProps {
  menu: Electron.Menu;
  setShadow(shadow: any): void;
}

const MenuLayerStyleShadow = (props: MenuLayerStyleShadowProps): ReactElement => {
  const { menu, setShadow } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.style.shadow);
  const isEnabled = useSelector((state: RootState) => canToggleSelectedShadow(state));
  const isChecked = useSelector((state: RootState) => selectedShadowEnabled(state));
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Shadow',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    type: 'checkbox',
    checked: isChecked,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectedShadowThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setShadow(menuItemTemplate);
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

export default MenuLayerStyleShadow;