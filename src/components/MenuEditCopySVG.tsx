import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copySVGThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editCopySVG';

const MenuEditCopySVG = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const canCopy = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canCopy;
  }, [canCopy]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(copySVGThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditCopySVG,
  MENU_ITEM_ID
);