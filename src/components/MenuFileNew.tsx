import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { saveDocumentThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileNew';

interface MenuAppThemeProps {
  menu: Electron.Menu;
  setNewDocument(newDocument: any): void;
}

const MenuFileNew = (props: MenuAppThemeProps): ReactElement => {
  const { menu, setNewDocument } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'New',
    id: MENU_ITEM_ID,
    enabled: true,
    accelerator: remote.process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event): void => {
      // if (browserWindow) {
      //   getFocusedDocumentFromRenderer(browserWindow).then((focusedDocument) => {
      //     const size = focusedDocument.getSize();
      //     createNewDocument({width: size[0], height: size[1]});
      //   });
      // } else {
      //   createNewDocument({});
      // }
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setNewDocument(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  return (
    <></>
  );
}

export default MenuFileNew;