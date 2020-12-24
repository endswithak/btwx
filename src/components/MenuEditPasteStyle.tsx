import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteStyleThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editPasteStyle';

const MenuEditPasteStyle = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canPasteStyle = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canPasteStyle && !isResizing && !isDragging && !isDrawing;
  }, [canPasteStyle, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(pasteStyleThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditPasteStyle,
  MENU_ITEM_ID
);