import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteSVGThunk } from '../store/actions/layer';
import { canPasteSVG } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editPasteSVG';

const MenuEditPasteSVG = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const canPaste = useSelector((state: RootState) => canPasteSVG() && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canPaste;
  }, [canPaste]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(pasteSVGThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditPasteSVG,
  MENU_ITEM_ID
);