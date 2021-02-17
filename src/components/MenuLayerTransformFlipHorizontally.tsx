/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedHorizontalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedHorizontalFlipEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerTransformFlipHorizontally';

interface MenuLayerTransformFlipHorizontallyProps {
  menu: Electron.Menu;
  setHorizontalFlip(horizontalFlip: any): void;
}

const MenuLayerTransformFlipHorizontally = (props: MenuLayerTransformFlipHorizontallyProps): ReactElement => {
  const { menu, setHorizontalFlip } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.layer.transform.flipHorizontally);
  const isEnabled = useSelector((state: RootState) => canFlipSeleted(state));
  const isChecked = useSelector((state: RootState) => selectedHorizontalFlipEnabled(state));
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Flip Horizontally',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    type: 'checkbox',
    checked: isChecked,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(toggleSelectedHorizontalFlipThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setHorizontalFlip(menuItemTemplate);
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

export default MenuLayerTransformFlipHorizontally;