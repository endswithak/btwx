/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copySVGThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopySVG';

interface MenuEditCopySVGProps {
  menu: Electron.Menu;
  setCopySVG(copySVG: any): void;
}

const MenuEditCopySVG = (props: MenuEditCopySVGProps): ReactElement => {
  const { menu, setCopySVG } = props;
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length > 0 &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Copy SVG Code',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(copySVGThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setCopySVG(menuItemTemplate);
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

export default MenuEditCopySVG;