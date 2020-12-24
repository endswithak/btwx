import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'insertShapeEllipse';

const MenuInsertShapeEllipse = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingEllipse = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Ellipse');
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing;
  }, [canInsert, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    menuItem.checked = insertingEllipse;
  }, [insertingEllipse]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleShapeToolThunk('Ellipse'));
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuInsertShapeEllipse,
  MENU_ITEM_ID
);