/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { saveDocumentThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileSave';

interface MenuFileSaveProps {
  setSave(save: any): void;
}

const MenuFileSave = (props: MenuFileSaveProps): ReactElement => {
  const { setSave } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Save',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(saveDocumentThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSave = useSelector((state: RootState) => state.layer.present.edit && state.layer.present.edit.id !== state.documentSettings.edit);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canSave && !isResizing && !isDragging && !isDrawing;
    }
  }, [canSave, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setSave(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuFileSave;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { saveDocumentThunk } from '../store/actions/documentSettings';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'fileSave';

// const MenuFileSave = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canSave = useSelector((state: RootState) => state.layer.present.edit && state.layer.present.edit.id !== state.documentSettings.edit);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canSave && !isResizing && !isDragging && !isDrawing;
//   }, [canSave, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(saveDocumentThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuFileSave,
//   MENU_ITEM_ID
// );