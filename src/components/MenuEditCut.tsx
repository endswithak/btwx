import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editCut';

const MenuEditCut = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const canCut = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canCut;
  }, [canCut]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(removeLayersThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditCut,
  MENU_ITEM_ID
);