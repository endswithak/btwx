import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEditingThunk } from '../store/actions/leftSidebar';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editRename';

const MenuEditRename = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canRename = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.leftSidebar.editing !== state.layer.present.selected[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canRename && !isResizing && !isDragging && !isDrawing;
  }, [canRename, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(setEditingThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditRename,
  MENU_ITEM_ID
);