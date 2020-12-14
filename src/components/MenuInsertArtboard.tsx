import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';

export const MENU_ITEM_ID = 'insertArtboard';

const MenuInsertArtboard = (): ReactElement => {
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Artboard');
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canInsert;
    electronMenuItem.checked = isChecked;
  }, [canInsert, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleArtboardToolThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuInsertArtboard;