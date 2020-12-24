import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { replaceSelectedImagesThunk } from '../store/actions/layer';
import { canReplaceSelectedImages } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerImageReplace';

const MenuLayerImageReplace = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && canReplaceSelectedImages(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
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

export default MenuItem(
  MenuLayerImageReplace,
  MENU_ITEM_ID
);