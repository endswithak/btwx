import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { setSearching } from '../store/actions/leftSidebar';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'editFind';

const MenuEditFind = (): ReactElement => {
  const canFind = useSelector((state: RootState) => state.layer.present.childrenById.root.length !== 0);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canFind;
  }, [canFind]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      const layersSearchInput = document.getElementById('layers-search-input');
      dispatch(setSearching({searching: true}));
      layersSearchInput.focus();
    };
  }, []);

  return (
    <></>
  );
}

export default MenuEditFind;