import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedFillThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedFillEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerStyleFill';

const MenuLayerStyleFill = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => canToggleSelectedFillOrStroke(state));
  const isChecked = useSelector((state: RootState) => selectedFillEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedFillThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerStyleFill;