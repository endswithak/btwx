import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedVerticalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedVerticalFlipEnabled } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerTransformFlipVertically';

const MenuLayerTransformFlipVertically = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => canFlipSeleted(state));
  const isChecked = useSelector((state: RootState) => selectedVerticalFlipEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    menuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedVerticalFlipThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuLayerTransformFlipVertically,
  MENU_ITEM_ID
);