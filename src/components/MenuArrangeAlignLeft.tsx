import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignSelectedToLeftThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeAlignLeft';

const MenuArrangeAlignLeft = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 2);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(alignSelectedToLeftThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuArrangeAlignLeft;