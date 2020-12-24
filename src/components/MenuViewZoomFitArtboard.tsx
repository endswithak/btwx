import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomFitActiveArtboardThunk } from '../store/actions/zoomTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'viewZoomFitArtboard';

const MenuViewZoomFitArtboard = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canZoom = useSelector((state: RootState) => state.layer.present.activeArtboard !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canZoom && !isResizing && !isDragging && !isDrawing;
  }, [canZoom, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(zoomFitActiveArtboardThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuViewZoomFitArtboard,
  MENU_ITEM_ID
);