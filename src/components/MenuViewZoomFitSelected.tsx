import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitSelectedThunk } from '../store/actions/zoomTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'viewZoomFitSelected';

const MenuViewZoomFitSelected = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canZoom = useSelector((state: RootState) => state.layer.present.selected.length > 0);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canZoom && !isResizing && !isDragging && !isDrawing;
  }, [canZoom, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(zoomFitSelectedThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuViewZoomFitSelected,
  MENU_ITEM_ID
);