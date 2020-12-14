import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectLayers } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editSelectAllArtboards';

const MenuEditSelectAllArtboards = (): ReactElement => {
  const allArtboardIds = useSelector((state: RootState) => state.layer.present.allArtboardIds);
  const canSelectAllArtboards = useSelector((state: RootState) => state.layer.present.allArtboardIds.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canSelectAllArtboards;
  }, [canSelectAllArtboards]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(selectLayers({layers: allArtboardIds, newSelection: true}));
    };
  }, [allArtboardIds]);

  return (
    <></>
  );
}

export default MenuEditSelectAllArtboards;