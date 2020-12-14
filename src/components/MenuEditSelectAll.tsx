import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllLayers } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAll';

const MenuEditSelectAll = (): ReactElement => {
  const canSelectAll = useSelector((state: RootState) => state.layer.present.allIds.length > 1 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canSelectAll;
  }, [canSelectAll]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(selectAllLayers());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuEditSelectAll;