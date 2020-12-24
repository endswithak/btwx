import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedStrokeThunk } from '../store/actions/layer';
import { canToggleSelectedFillOrStroke, selectedStrokeEnabled } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerStyleStroke';

const MenuLayerStyleStroke = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isEnabled = useSelector((state: RootState) => canToggleSelectedFillOrStroke(state));
  const isChecked = useSelector((state: RootState) => selectedStrokeEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    menuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedStrokeThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuLayerStyleStroke,
  MENU_ITEM_ID
);