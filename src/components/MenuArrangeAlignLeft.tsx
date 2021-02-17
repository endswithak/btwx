/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedLeft } from '../store/selectors/layer';
import { alignSelectedToLeftThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignLeft';

interface MenuArrangeAlignLeftProps {
  menu: Electron.Menu;
  setLeft(left: any): void;
}

const MenuArrangeAlignLeft = (props: MenuArrangeAlignLeftProps): ReactElement => {
  const { menu, setLeft } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.align.left);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 2 &&
    getSelectedLeft(state) === 'multi'
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Left',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(alignSelectedToLeftThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setLeft(menuItemTemplate);
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

export default MenuArrangeAlignLeft;