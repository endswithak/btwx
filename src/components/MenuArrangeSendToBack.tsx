import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { sendSelectedToBackThunk } from '../store/actions/layer';
import { canSendSelectedBackward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeSendToBack';

const MenuArrangeSendToBack = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => canSendSelectedBackward(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(sendSelectedToBackThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuArrangeSendToBack;