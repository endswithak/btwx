import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canGroupSelected } from '../store/selectors/layer';
import { groupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeGroup';

const MenuArrangeGroup = (): ReactElement => {
  const canGroup = useSelector((state: RootState) => canGroupSelected(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canGroup;
  }, [canGroup]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(groupSelectedThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuArrangeGroup;