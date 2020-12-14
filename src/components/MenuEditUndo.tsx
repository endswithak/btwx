import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { undoThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editUndo';

const MenuEditUndo = (): ReactElement => {
  const canUndo = useSelector((state: RootState) => state.layer.past.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canUndo;
  }, [canUndo]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(undoThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuEditUndo;