/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveDocumentAsThunk } from '../store/actions/documentSettings';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileSaveAs';

interface MenuFileSaveAsProps {
  setSaveAs(saveAs: any): void;
}

const MenuFileSaveAs = (props: MenuFileSaveAsProps): ReactElement => {
  const { setSaveAs } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Save As...',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(saveDocumentAsThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = !isResizing && !isDragging && !isDrawing;
    }
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setSaveAs(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuFileSaveAs;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { saveDocumentAsThunk } from '../store/actions/documentSettings';
// import { RootState } from '../store/reducers';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'fileSaveAs';

// const MenuFileSaveAs = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = !isResizing && !isDragging && !isDrawing;
//   }, [isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): Promise<any> => {
//       return new Promise((resolve, reject) => {
//         (dispatch(saveDocumentAsThunk()) as any).then(() => {
//           resolve(null);
//         });
//       });
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuFileSaveAs,
//   MENU_ITEM_ID
// );