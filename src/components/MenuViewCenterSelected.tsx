import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { centerSelectedThunk } from '../store/actions/translateTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'viewCenterSelected';

const MenuViewCenterSelected = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canCenter = useSelector((state: RootState) => state.layer.present.selected.length > 0);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canCenter && !isResizing && !isDragging && !isDrawing;
  }, [canCenter, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(centerSelectedThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuViewCenterSelected,
  MENU_ITEM_ID
);