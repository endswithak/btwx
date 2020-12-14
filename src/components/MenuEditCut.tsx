import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCut';

const MenuEditCut = (): ReactElement => {
  const canCut = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canCut;
  }, [canCut]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(removeLayersThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuEditCut;