import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'insertShapeRectangle';

const MenuInsertShapeRectangle = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingRectangle = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rectangle');
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing;
  }, [canInsert, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    menuItem.checked = insertingRectangle;
  }, [insertingRectangle]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleShapeToolThunk('Rectangle'));
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuInsertShapeRectangle,
  MENU_ITEM_ID
);