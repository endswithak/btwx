import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { saveDocumentThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileSave';

const MenuFileSave = (): ReactElement => {
  const canSave = useSelector((state: RootState) => state.layer.present.edit && state.layer.present.edit.id !== state.documentSettings.edit);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canSave;
  }, [canSave]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(saveDocumentThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuFileSave;