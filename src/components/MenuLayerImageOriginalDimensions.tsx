import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { resetSelectedImageDimensionsThunk } from '../store/actions/layer';
import { canResetSelectedImageDimensions } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageOriginalDimensions';

const MenuLayerImageOriginalDimensions = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && canResetSelectedImageDimensions(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(resetSelectedImageDimensionsThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerImageOriginalDimensions;