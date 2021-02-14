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
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Replace...',
    id: MENU_ITEM_ID,
    enabled: false,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(replaceSelectedImagesThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && canReplaceSelectedImages(state));
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