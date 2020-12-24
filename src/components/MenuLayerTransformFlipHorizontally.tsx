import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedHorizontalFlipThunk } from '../store/actions/layer';
import { canFlipSeleted, selectedHorizontalFlipEnabled } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerTransformFlipHorizontally';

const MenuLayerTransformFlipHorizontally = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => canFlipSeleted(state));
  const isChecked = useSelector((state: RootState) => selectedHorizontalFlipEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    menuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedHorizontalFlipThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuLayerTransformFlipHorizontally,
  MENU_ITEM_ID
);