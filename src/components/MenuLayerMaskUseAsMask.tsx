import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectedMaskThunk } from '../store/actions/layer';
import { canToggleSelectedUseAsMask, selectedUseAsMaskEnabled } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerMaskUseAsMask';

const MenuLayerMaskUseAsMask = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canMask = useSelector((state: RootState) => canToggleSelectedUseAsMask(state));
  const usingAsMask = useSelector((state: RootState) => selectedUseAsMaskEnabled(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canMask && !isResizing && !isDragging && !isDrawing;
  }, [canMask, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    menuItem.checked = usingAsMask;
  }, [usingAsMask]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleSelectedMaskThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuLayerMaskUseAsMask,
  MENU_ITEM_ID
);