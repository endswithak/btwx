import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignSelectedToLeftThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'arrangeAlignLeft';

const MenuArrangeAlignLeft = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 2);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(alignSelectedToLeftThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuArrangeAlignLeft,
  MENU_ITEM_ID
);