import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleTweenDrawerThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowEvents';

const MenuViewShowEvents = (): ReactElement => {
  const isChecked = useSelector((state: RootState) => state.viewSettings.tweenDrawer.isOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleTweenDrawerThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuViewShowEvents;