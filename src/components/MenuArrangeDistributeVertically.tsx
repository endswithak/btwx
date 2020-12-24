import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { distributeSelectedVerticallyThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'arrangeDistributeVertically';

const MenuArrangeDistributeVertically = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canDistribute = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 3);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canDistribute && !isResizing && !isDragging && !isDrawing;
  }, [canDistribute, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(distributeSelectedVerticallyThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuArrangeDistributeVertically,
  MENU_ITEM_ID
);