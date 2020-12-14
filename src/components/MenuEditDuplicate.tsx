import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { duplicateSelectedThunk } from '../store/actions/layer';
import { getSelectedById } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'editDuplicate';

const MenuEditDuplicate = (): ReactElement => {
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const canDuplicate = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canDuplicate;
  }, [canDuplicate]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(duplicateSelectedThunk());
    };
  }, [selectedById]);

  return (
    <></>
  );
}

export default MenuEditDuplicate;