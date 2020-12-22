import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEditing } from '../store/actions/leftSidebar';

export const MENU_ITEM_ID = 'editRename';

const MenuEditRename = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const canRename = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.leftSidebar.editing !== state.layer.present.selected[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canRename;
  }, [canRename]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(setEditing({editing: selected[0]}));
    };
  }, [selected]);

  return (
    <></>
  );
}

export default MenuEditRename;