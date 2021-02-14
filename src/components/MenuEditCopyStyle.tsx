/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { copyStyleThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editCopyStyle';

interface MenuEditCopyStyleProps {
  setCopyStyle(copyStyle: any): void;
}

const MenuEditCopyStyle = (props: MenuEditCopyStyleProps): ReactElement => {
  const { setCopyStyle } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Copy Style',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Alt+C' : 'Ctrl+Alt+C',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(copyStyleThunk());
    }
  })
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canCopy = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canCopy && !isResizing && !isDragging && !isDrawing
    }
  }, [canCopy, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setCopyStyle(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditCopyStyle;

// import React, { ReactElement, useEffect, } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { copyStyleThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editCopyStyle';

// const MenuEditCopyStyle = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canCopy = useSelector((state: RootState) => state.layer.present.selected.length === 1 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canCopy && !isResizing && !isDragging && !isDrawing;
//   }, [canCopy, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(copyStyleThunk());
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditCopyStyle,
//   MENU_ITEM_ID
// );