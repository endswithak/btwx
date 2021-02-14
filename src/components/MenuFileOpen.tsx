/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { openDocumentThunk } from '../store/actions/documentSettings';
import { APP_NAME } from '../constants';
import { RootState } from '../store/reducers';

export const MENU_ITEM_ID = 'fileOpen';

interface MenuFileOpenProps {
  menu: Electron.Menu;
  setOpen(open: any): void;
}

const MenuFileOpen = (props: MenuFileOpenProps): ReactElement => {
  const { menu, setOpen } = props;
  const isEnabled = useSelector((state: RootState) =>
    !state.canvasSettings.dragging &&
    !state.canvasSettings.resizing &&
    !state.canvasSettings.drawing
  );
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Open...',
    id: 'fileOpen',
    enabled: isEnabled,
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
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(menuItemTemplate);
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

export default MenuFileOpen;