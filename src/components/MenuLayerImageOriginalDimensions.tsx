import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { resetSelectedImageDimensionsThunk } from '../store/actions/layer';
import { canResetSelectedImageDimensions } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerImageOriginalDimensions';

const MenuLayerImageOriginalDimensions = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && canResetSelectedImageDimensions(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
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

export default MenuItem(
  MenuLayerImageOriginalDimensions,
  MENU_ITEM_ID
);