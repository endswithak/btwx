import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { saveDocumentThunk } from '../store/actions/documentSettings';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'fileSave';

const MenuFileSave = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSave = useSelector((state: RootState) => state.layer.present.edit && state.layer.present.edit.id !== state.documentSettings.edit);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = canSave && !isResizing && !isDragging && !isDrawing;
  }, [canSave, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      dispatch(saveDocumentThunk());
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuFileSave,
  MENU_ITEM_ID
);