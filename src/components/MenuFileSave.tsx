/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { saveDocumentThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileSave';

interface MenuFileSaveProps {
  menu: Electron.Menu;
  setSave(save: any): void;
}

const MenuFileSave = (props: MenuFileSaveProps): ReactElement => {
  const { menu, setSave } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Save',
    id: MENU_ITEM_ID,
    enabled: false,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(saveDocumentThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDrawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const canSave = useSelector((state: RootState) => state.layer.present.edit && state.layer.present.edit.id !== state.documentSettings.edit);
  const dispatch = useDispatch();

  useEffect(() => {
    setSave(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = canSave && !isResizing && !isDragging && !isDrawing;
    }
  }, [canSave, isDragging, isResizing, isDrawing]);

  return (
    <></>
  );
}

export default MenuFileSave;