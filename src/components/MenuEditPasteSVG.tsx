/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteSVGThunk } from '../store/actions/layer';
import { canPasteSVG } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editPasteSVG';

interface MenuEditPasteSVGProps {
  menu: Electron.Menu;
  setPasteSVG(pasteSVG: any): void;
}

const MenuEditPasteSVG = (props: MenuEditPasteSVGProps): ReactElement => {
  const { menu, setPasteSVG } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.edit.paste.svg);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Paste SVG Code',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteSVGThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setPasteSVG(menuItemTemplate);
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

export default MenuEditPasteSVG;