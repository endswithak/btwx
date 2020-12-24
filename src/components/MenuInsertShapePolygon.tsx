import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'insertShapePolygon';

const MenuInsertShapePolygon = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Polygon');
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canInsert;
  }, [canInsert]);

  useEffect(() => {
    menuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleShapeToolThunk('Polygon'));
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuInsertShapePolygon,
  MENU_ITEM_ID
);