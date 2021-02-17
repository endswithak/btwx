/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveDocumentAsThunk } from '../store/actions/documentSettings';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileSaveAs';

interface MenuFileSaveAsProps {
  menu: Electron.Menu;
  setSaveAs(saveAs: any): void;
}

const MenuFileSaveAs = (props: MenuFileSaveAsProps): ReactElement => {
  const { menu, setSaveAs } = props;
  const accelerator = useSelector((state: RootState) => state.keyBindings.file.saveAs);
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Save As...',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(saveDocumentAsThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setSaveAs(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  return (
    <></>
  );
}

export default MenuFileSaveAs;