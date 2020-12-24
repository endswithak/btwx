import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleEventDrawerThunk } from '../store/actions/viewSettings';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'viewShowEvents';

const MenuViewShowEvents = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const isOpen = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = !isResizing && !isDragging && !isDrawing;
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    menuItem.checked = isOpen;
  }, [isOpen]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(toggleEventDrawerThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuViewShowEvents,
  MENU_ITEM_ID
);