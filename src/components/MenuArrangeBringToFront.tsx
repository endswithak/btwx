import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedToFrontThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'arrangeBringToFront';

const MenuArrangeBringToFront = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canMove = useSelector((state: RootState) => canBringSelectedForward(state) && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canMove && !isResizing && !isDragging && !isDrawing;
  }, [canMove, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(bringSelectedToFrontThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuArrangeBringToFront,
  MENU_ITEM_ID
);