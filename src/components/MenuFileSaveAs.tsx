import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useDispatch } from 'react-redux';
import { saveDocumentAsThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileSaveAs';

const MenuFileSaveAs = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
  }, []);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        (dispatch(saveDocumentAsThunk()) as any).then(() => {
          resolve(null);
        });
      });
    };
  }, []);

  return (
    <></>
  );
}

export default MenuFileSaveAs;