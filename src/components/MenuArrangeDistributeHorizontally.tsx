import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedHorizontallyThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeDistributeHorizontally';

const MenuArrangeDistributeHorizontally = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 3);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(distributeSelectedHorizontallyThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuArrangeDistributeHorizontally;