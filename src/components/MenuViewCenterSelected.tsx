import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { centerSelectedThunk } from '../store/actions/translateTool';

export const MENU_ITEM_ID = 'viewCenterSelected';

const MenuViewCenterSelected = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => state.layer.present.selected.length > 0);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(centerSelectedThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuViewCenterSelected;