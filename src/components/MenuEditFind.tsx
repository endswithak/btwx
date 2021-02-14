/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearching } from '../store/actions/leftSidebar';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'editFind';

interface MenuEditFindProps {
  setFind(find: any): void;
}

const MenuEditFind = (props: MenuEditFindProps): ReactElement => {
  const { setFind } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Find Layer',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+F' : 'Ctrl+F',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      const layersSearchInput = document.getElementById('layers-search-input');
      dispatch(setSearching({searching: true}));
      layersSearchInput.focus();
    }
  });
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canFind = useSelector((state: RootState) => state.layer.present.byId.root.children.length !== 0);
  const dispatch = useDispatch();

  useEffect(() => {
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.enabled = canFind && !isResizing && !isDragging && !isDrawing;
    }
  }, [canFind, isDragging, isResizing, isDrawing]);

  useEffect(() => {
    setFind(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuEditFind;

// import React, { ReactElement, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setSearching } from '../store/actions/leftSidebar';
// import { RootState } from '../store/reducers';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'editFind';

// const MenuEditFind = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
//   const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
//   const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
//   const canFind = useSelector((state: RootState) => state.layer.present.byId.root.children.length !== 0);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = canFind && !isResizing && !isDragging && !isDrawing;
//   }, [canFind, isDragging, isResizing, isDrawing]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (): void => {
//       const layersSearchInput = document.getElementById('layers-search-input');
//       dispatch(setSearching({searching: true}));
//       layersSearchInput.focus();
//     };
//   }, []);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuEditFind,
//   MENU_ITEM_ID
// );