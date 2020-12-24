import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllLayers } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editSelectAll';

const MenuEditSelectAll = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSelectAll = useSelector((state: RootState) => state.layer.present.allIds.length > 1 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canSelectAll && !isResizing && !isDragging && !isDrawing;
  }, [canSelectAll, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(selectAllLayers());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditSelectAll,
  MENU_ITEM_ID
);