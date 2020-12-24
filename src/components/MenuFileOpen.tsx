import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { openDocumentThunk } from '../store/actions/documentSettings';
import { APP_NAME } from '../constants';
import { RootState } from '../store/reducers';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'fileOpen';

const MenuFileOpen = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = !isResizing && !isDragging && !isDrawing;
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      remote.dialog.showOpenDialog({
        filters: [
          { name: 'Custom File Type', extensions: [APP_NAME] }
        ],
        properties: ['openFile']
      }).then((result) => {
        if (result.filePaths.length > 0 && !result.canceled) {
          dispatch(openDocumentThunk(result.filePaths[0]));
        }
      });
    };
  }, []);

  return (
    <></>
  );
}

export default MenuItem(
  MenuFileOpen,
  MENU_ITEM_ID
);