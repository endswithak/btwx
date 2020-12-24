import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'arrangeUngroup';

const MenuArrangeUngroup = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canUngroup && !isResizing && !isDragging && !isDrawing;
  }, [canUngroup, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(ungroupSelectedThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuArrangeUngroup,
  MENU_ITEM_ID
);