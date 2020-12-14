import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';

export const MENU_ITEM_ID = 'viewZoomFitArtboard';

const MenuViewZoomFitArtboard = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => state.layer.present.activeArtboard !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(zoomFitActiveArtboardThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuViewZoomFitArtboard;