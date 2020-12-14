import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedMaskThunk } from '../store/actions/layer';
import { canToggleSelectedUseAsMask, selectedUseAsMaskEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerMaskUseAsMask';

const MenuLayerMaskUseAsMask = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => canToggleSelectedUseAsMask(state));
  const isChecked = useSelector((state: RootState) => selectedUseAsMaskEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedMaskThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerMaskUseAsMask;