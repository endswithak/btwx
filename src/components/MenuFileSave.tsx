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
  const accelerator = useSelector((state: RootState) => state.keyBindings.file.save);
  const isEnabled = useSelector((state: RootState) =>
    state.layer.present.edit &&
    state.layer.present.edit.id !== state.documentSettings.edit &&
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Save',
    id: MENU_ITEM_ID,
    enabled: isEnabled,
    accelerator,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      dispatch(saveDocumentThunk());
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
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
      menuItem.enabled = isEnabled;
    }
  }, [isEnabled]);

  return (
    <></>
  );
}

export default MenuFileSave;