import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteStyleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPasteStyle';

const MenuEditPasteStyle = (): ReactElement => {
  const canPasteStyle = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canPasteStyle;
  }, [canPasteStyle]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(pasteStyleThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuEditPasteStyle;