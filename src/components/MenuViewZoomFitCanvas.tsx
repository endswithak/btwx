import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomFitCanvasThunk } from '../store/actions/zoomTool';
import { RootState } from '../store/reducers';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'viewZoomFitCanvas';

const MenuViewZoomFitCanvas = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = !isResizing && !isDragging && !isDrawing;
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(zoomFitCanvasThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuViewZoomFitCanvas,
  MENU_ITEM_ID
);