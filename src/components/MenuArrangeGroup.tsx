import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canGroupSelected } from '../store/selectors/layer';
import { groupSelectedThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'arrangeGroup';

const MenuArrangeGroup = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canGroup = useSelector((state: RootState) => canGroupSelected(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canGroup && !isResizing && !isDragging && !isDrawing;
  }, [canGroup, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(groupSelectedThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuArrangeGroup,
  MENU_ITEM_ID
);