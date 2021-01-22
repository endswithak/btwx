import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'insertArtboard';

const MenuInsertArtboard = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isSelecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const isFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const isChecked = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Artboard');
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = isFocusing && !isResizing && !isDragging && !isDrawing && !isSelecting;
  }, [isFocusing, isDragging, isResizing, isDrawing, isSelecting]);

  useEffect(() => {
    menuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleArtboardToolThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuInsertArtboard,
  MENU_ITEM_ID
);