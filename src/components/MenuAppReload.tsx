import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'appReload';

const MenuAppReload = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);

  useEffect(() => {
    menuItem.enabled = !isResizing && !isDragging && !isDrawing;
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      remote.getCurrentWebContents().reload();
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuAppReload,
  MENU_ITEM_ID
);