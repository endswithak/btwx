import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleTextToolThunk } from '../store/actions/textTool';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'insertText';

const MenuInsertText = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canInsert = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.activeArtboard !== null);
  const insertingText = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Text');
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canInsert && !isResizing && !isDragging && !isDrawing;
  }, [canInsert, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    menuItem.checked = insertingText;
  }, [insertingText]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleTextToolThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuInsertText,
  MENU_ITEM_ID
);