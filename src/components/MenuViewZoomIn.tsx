import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useDispatch } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomIn';

const MenuViewZoomIn = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(zoomInThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuViewZoomIn;