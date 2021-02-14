/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearching } from '../store/actions/leftSidebar';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'editFind';

interface MenuEditFindProps {
  menu: Electron.Menu;
  setFind(find: any): void;
}

const MenuEditFind = (props: MenuEditFindProps): ReactElement => {
  const { menu, setFind } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
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
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canFind = useSelector((state: RootState) => state.layer.present.byId.root.children.length !== 0);
  const dispatch = useDispatch();

  useEffect(() => {
    setFind(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canFind && !isResizing && !isDragging && !isDrawing;
    }
  }, [canFind, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuEditFind;