import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectionIgnoreUnderlyingMask } from '../store/actions/layer';
import { selectedIgnoreUnderlyingMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskIgnoreUnderlyingMask';

const MenuLayerMaskToggleUnderlyingMask = (): ReactElement => {
  const isChecked = useSelector((state: RootState) => selectedIgnoreUnderlyingMaskEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectionIgnoreUnderlyingMask());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerMaskToggleUnderlyingMask;