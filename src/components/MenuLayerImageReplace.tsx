import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { replaceSelectedImagesThunk } from '../store/actions/layer';
import { canReplaceSelectedImages } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'layerImageReplace';

const MenuLayerImageReplace = (): ReactElement => {
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && canReplaceSelectedImages(state));
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(replaceSelectedImagesThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuLayerImageReplace;