import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'layerCombineDifference';

const MenuLayerCombineDifference = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canBool = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canBool && !isResizing && !isDragging && !isDrawing;
  }, [canBool, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(applyBooleanOperationThunk('exclude'));
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuLayerCombineDifference,
  MENU_ITEM_ID
);