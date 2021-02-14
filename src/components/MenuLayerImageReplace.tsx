/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { replaceSelectedImagesThunk } from '../store/actions/layer';
import { canReplaceSelectedImages } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageReplace';

interface MenuLayerImageReplaceProps {
  menu: Electron.Menu;
  setReplace(replace: any): void;
}

const MenuLayerImageReplace = (props: MenuLayerImageReplaceProps): ReactElement => {
  const { menu, setReplace } = props;
  const isEnabled = useSelector((state: RootState) =>
    canReplaceSelectedImages(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Replace...',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(replaceSelectedImagesThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setReplace(menuItemTemplate);
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

export default MenuLayerImageReplace;