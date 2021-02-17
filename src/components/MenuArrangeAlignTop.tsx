/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedTop } from '../store/selectors/layer';
import { alignSelectedToTopThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignTop';

interface MenuArrangeAlignTopProps {
  menu: Electron.Menu;
  setTop(top: any): void;
}

const MenuArrangeAlignTop = (props: MenuArrangeAlignTopProps): ReactElement => {
  const { menu, setTop } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.align.top);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.selected.length >= 2 &&
    getSelectedTop(state) === 'multi'
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Top',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(alignSelectedToTopThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setTop(menuItemTemplate);
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

export default MenuArrangeAlignTop;