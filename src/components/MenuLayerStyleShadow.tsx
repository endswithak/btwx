import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedShadowThunk } from '../store/actions/layer';
import { canToggleSelectedShadow, selectedShadowEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleShadow';

const MenuLayerStyleShadow = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => canToggleSelectedShadow(state));
  const isChecked = useSelector((state: RootState) => selectedShadowEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedShadowThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerStyleShadow;