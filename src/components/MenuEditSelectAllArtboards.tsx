import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectAllArtboardsThunk } from '../store/actions/layer';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editSelectAllArtboards';

const MenuEditSelectAllArtboards = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSelectAllArtboards = useSelector((state: RootState) => state.layer.present.allArtboardIds.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canSelectAllArtboards && !isResizing && !isDragging && !isDrawing;
  }, [canSelectAllArtboards, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(selectAllArtboardsThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditSelectAllArtboards,
  MENU_ITEM_ID
);