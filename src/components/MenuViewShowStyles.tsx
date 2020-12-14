import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleRightSidebarThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowStyles';

const MenuViewShowStyles = (): ReactElement => {
  const isChecked = useSelector((state: RootState) => state.viewSettings.rightSidebar.isOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleRightSidebarThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuViewShowStyles;