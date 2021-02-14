/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { resetSelectedImageDimensionsThunk } from '../store/actions/layer';
import { canResetSelectedImageDimensions } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageOriginalDimensions';

interface MenuLayerImageOriginalDimensionsProps {
  menu: Electron.Menu;
  setOriginalDims(originalDims: any): void;
}

const MenuLayerImageOriginalDimensions = (props: MenuLayerImageOriginalDimensionsProps): ReactElement => {
  const { menu, setOriginalDims } = props;
  const isEnabled = useSelector((state: RootState) =>
    canResetSelectedImageDimensions(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Set to Original Dimensions',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(resetSelectedImageDimensionsThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setOriginalDims(menuItemTemplate);
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

  return (
    <></>
  );
}

export default MenuLayerImageOriginalDimensions;