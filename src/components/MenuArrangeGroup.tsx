/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canGroupSelected } from '../store/selectors/layer';
import { groupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeGroup';

interface MenuArrangeGroupProps {
  menu: Electron.Menu;
  setGroup(group: any): void;
}

const MenuArrangeGroup = (props: MenuArrangeGroupProps): ReactElement => {
  const { menu, setGroup } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.arrange.group);
  const isEnabled = useSelector((state: RootState) =>
    canGroupSelected(state) &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Group',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(groupSelectedThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setGroup(menuItemTemplate);
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

export default MenuArrangeGroup;