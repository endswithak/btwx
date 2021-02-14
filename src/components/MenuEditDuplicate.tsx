/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { duplicateSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editDuplicate';

interface MenuEditDuplicateProps {
  setDuplicate(duplicate: any): void;
}

const MenuEditDuplicate = (props: MenuEditDuplicateProps): ReactElement => {
  const { setDuplicate } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Duplicate',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+D' : 'Ctrl+D',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(duplicateSelectedThunk());
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canDuplicate = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canDuplicate && !isResizing && !isDragging && !isDrawing;
    }
  }, [canDuplicate, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setDuplicate(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditDuplicate;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { duplicateSelectedThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editDuplicate';

// const MenuEditDuplicate = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canDuplicate = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canDuplicate && !isResizing && !isDragging && !isDrawing;
//   }, [canDuplicate, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(duplicateSelectedThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditDuplicate,
//   MENU_ITEM_ID
// );