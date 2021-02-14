/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { pasteLayersThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'editPasteOverSelection';

interface MenuEditPasteOverSelectionProps {
  setPasteOverSelection(pasteOverSelection: any): void;
}

const MenuEditPasteOverSelection = (props: MenuEditPasteOverSelectionProps): ReactElement => {
  const { setPasteOverSelection } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Paste Over Selection',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+Shift+V' : 'Ctrl+Shift+V',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(pasteLayersThunk({overSelection: true}));
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canPasteOverSelection = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canPasteOverSelection && !isResizing && !isDragging && !isDrawing;
    }
  }, [canPasteOverSelection, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setPasteOverSelection(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditPasteOverSelection;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { pasteLayersThunk } from '../store/actions/layer';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editPasteOverSelection';

// const MenuEditPasteOverSelection = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canPasteOverSelection = useSelector((state: RootState) => state.layer.present.selected.length > 0 && state.canvasSettings.focusing);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canPasteOverSelection && !isResizing && !isDragging && !isDrawing;
//   }, [canPasteOverSelection, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       dispatch(pasteLayersThunk({overSelection: true}));
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditPasteOverSelection,
//   MENU_ITEM_ID
// );