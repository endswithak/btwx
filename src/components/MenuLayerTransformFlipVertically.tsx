import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedVerticalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedVerticalFlipEnabled } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerTransformFlipVertically';

const MenuLayerTransformFlipVertically = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => canFlipSeleted(state));
  const isChecked = useSelector((state: RootState) => selectedVerticalFlipEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
    electronMenuItem.checked = isChecked;
  }, [isEnabled, isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedVerticalFlipThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerTransformFlipVertically;