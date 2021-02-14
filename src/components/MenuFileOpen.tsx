/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { openDocumentThunk } from '../store/actions/documentSettings';
import { APP_NAME } from '../constants';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileOpen';

interface MenuFileOpenProps {
  setOpen(open: any): void;
}

const MenuFileOpen = (props: MenuFileOpenProps): ReactElement => {
  const { setOpen } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Open...',
    id: 'fileOpen',
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
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
    }
  })
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItem({
      ...menuItem,
      enabled: !isResizing && !isDragging && !isDrawing
    });
  }, [isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setOpen(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuFileOpen;

// import React, { ReactElement, useEffect } from 'react';
// import { remote } from 'electron';
// import { useSelector, useDispatch } from 'react-redux';
// import { openDocumentThunk } from '../store/actions/documentSettings';
// import { APP_NAME } from '../constants';
// import { RootState } from '../store/reducers';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'fileOpen';

// const MenuFileOpen = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = !isResizing && !isDragging && !isDrawing;
//   }, [isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       remote.dialog.showOpenDialog({
//         filters: [
//           { name: 'Custom File Type', extensions: [APP_NAME] }
//         ],
//         properties: ['openFile']
//       }).then((result) => {
//         if (result.filePaths.length > 0 && !result.canceled) {
//           dispatch(openDocumentThunk(result.filePaths[0]));
//         }
//       });
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuFileOpen,
//   MENU_ITEM_ID
// );