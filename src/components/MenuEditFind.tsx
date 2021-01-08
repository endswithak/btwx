import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearching } from '../store/actions/leftSidebar';
import { RootState } from '../store/reducers';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'editFind';

const MenuEditFind = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canFind = useSelector((state: RootState) => state.layer.present.byId.root.children.length !== 0);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canFind && !isResizing && !isDragging && !isDrawing;
  }, [canFind, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      const layersSearchInput = document.getElementById('layers-search-input');
      dispatch(setSearching({searching: true}));
      layersSearchInput.focus();
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuEditFind,
  MENU_ITEM_ID
);