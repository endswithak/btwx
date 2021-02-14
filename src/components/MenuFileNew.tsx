import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { saveDocumentThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileNew';

interface MenuAppThemeProps {
  setNewDocument(newDocument: any): void;
}

const MenuFileNew = (props: MenuAppThemeProps): ReactElement => {
  const { setNewDocument } = props;
  const [menuItem, setMenuItem] = useState({
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
  })
  const dispatch = useDispatch();

  useEffect(() => {
    setNewDocument(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuFileNew;