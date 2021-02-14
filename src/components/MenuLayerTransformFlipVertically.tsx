/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedVerticalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedVerticalFlipEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerTransformFlipVertically';

interface MenuLayerTransformFlipVerticallyProps {
  menu: Electron.Menu;
  setVerticalFlip(verticalFlip: any): void;
}

const MenuLayerTransformFlipVertically = (props: MenuLayerTransformFlipVerticallyProps): ReactElement => {
  const { menu, setVerticalFlip } = props;
  const isEnabled = useSelector((state: RootState) => canFlipSeleted(state));
  const isChecked = useSelector((state: RootState) => selectedVerticalFlipEnabled(state));
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Flip Vertically',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    type: 'checkbox',
    checked: isChecked,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectedVerticalFlipThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setVerticalFlip(menuItemTemplate);
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

export default MenuLayerTransformFlipVertically;