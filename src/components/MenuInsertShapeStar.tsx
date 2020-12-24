import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'insertShapeStar';

const MenuInsertShapeStar = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Star');
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canInsert;
  }, [canInsert]);

  useEffect(() => {
    menuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleShapeToolThunk('Star'));
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuInsertShapeStar,
  MENU_ITEM_ID
);