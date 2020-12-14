import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { redoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editRedo';

const MenuEditRedo = (): ReactElement => {
  const canRedo = useSelector((state: RootState) => state.layer.future.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canRedo;
  }, [canRedo]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(redoThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuEditRedo;