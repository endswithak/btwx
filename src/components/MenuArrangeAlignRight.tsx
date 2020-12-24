import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { alignSelectedToRightThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'arrangeAlignRight';

const MenuArrangeAlignRight = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 2);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(alignSelectedToRightThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuArrangeAlignRight,
  MENU_ITEM_ID
);