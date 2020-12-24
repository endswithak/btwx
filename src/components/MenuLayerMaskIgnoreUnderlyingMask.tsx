import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectionIgnoreUnderlyingMask } from '../store/actions/layer';
import { selectedIgnoreUnderlyingMaskEnabled } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerMaskIgnoreUnderlyingMask';

const MenuLayerMaskToggleUnderlyingMask = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const ignoringUnderlyingMask = useSelector((state: RootState) => selectedIgnoreUnderlyingMaskEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = !isResizing && !isDragging && !isDrawing;
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    menuItem.checked = ignoringUnderlyingMask;
  }, [ignoringUnderlyingMask]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectionIgnoreUnderlyingMask());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuLayerMaskToggleUnderlyingMask,
  MENU_ITEM_ID
);