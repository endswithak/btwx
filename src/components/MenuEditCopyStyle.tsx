import React, { ReactElement, useEffect, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copyStyleThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editCopyStyle';

const MenuEditCopyStyle = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canCopy = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canCopy && !isResizing && !isDragging && !isDrawing;
  }, [canCopy, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(copyStyleThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditCopyStyle,
  MENU_ITEM_ID
);