import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedForwardThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeBringForward';

const MenuArrangeBringForward = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => canBringSelectedForward(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(bringSelectedForwardThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuArrangeBringForward;