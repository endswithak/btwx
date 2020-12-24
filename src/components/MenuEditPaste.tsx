import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editPaste';

const MenuEditPaste = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canPaste = useSelector((state: RootState) => state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canPaste && !isResizing && !isDragging && !isDrawing;
  }, [canPaste, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(pasteLayersThunk({}));
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditPaste,
  MENU_ITEM_ID
);