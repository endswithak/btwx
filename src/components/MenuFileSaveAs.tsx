import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveDocumentAsThunk } from '../store/actions/documentSettings';
import { RootState } from '../store/reducers';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'fileSaveAs';

const MenuFileSaveAs = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = !isResizing && !isDragging && !isDrawing;
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        (dispatch(saveDocumentAsThunk()) as any).then(() => {
          resolve(null);
        });
      });
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuFileSaveAs,
  MENU_ITEM_ID
);