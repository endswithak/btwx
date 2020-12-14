import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeUngroup';

const MenuArrangeUngroup = (): ReactElement => {
  const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canUngroup;
  }, [canUngroup]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(ungroupSelectedThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuArrangeUngroup;