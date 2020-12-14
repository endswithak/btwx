import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useDispatch } from 'react-redux';
import { zoomOutThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomOut';

const MenuViewZoomOut = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(zoomOutThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuViewZoomOut;