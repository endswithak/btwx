import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';

export const MENU_ITEM_ID = 'appReload';

const MenuAppReload = (): ReactElement => {

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      remote.getCurrentWebContents().reload();
    };
  }, []);

  return (
    <></>
  );
}

export default MenuAppReload;