import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedShadowThunk } from '../store/actions/layer';
import { canToggleSelectedShadow, selectedShadowEnabled } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerStyleShadow';

const MenuLayerStyleShadow = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => canToggleSelectedShadow(state));
  const isChecked = useSelector((state: RootState) => selectedShadowEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    menuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedShadowThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuLayerStyleShadow,
  MENU_ITEM_ID
);