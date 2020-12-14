import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useDispatch } from 'react-redux';
import { zoomFitCanvasThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitCanvas';

const MenuViewZoomFitCanvas = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(zoomFitCanvasThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuViewZoomFitCanvas;