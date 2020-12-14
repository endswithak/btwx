import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useDispatch } from 'react-redux';
import { openDocumentThunk } from '../store/actions/documentSettings';
import { APP_NAME } from '../constants';

export const MENU_ITEM_ID = 'fileOpen';

const MenuFileOpen = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      remote.dialog.showOpenDialog({
        filters: [
          { name: 'Custom File Type', extensions: [APP_NAME] }
        ],
        properties: ['openFile']
      }).then((result) => {
        if (result.filePaths.length > 0 && !result.canceled) {
          dispatch(openDocumentThunk(result.filePaths[0]));
        }
      });
    };
  }, []);

  return (
    <></>
  );
}

export default MenuFileOpen;