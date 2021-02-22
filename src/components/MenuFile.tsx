import React, { ReactElement, useState, useEffect } from 'react';
import { remote } from 'electron';
import MenuFileNew from './MenuFileNew';
import MenuFileSave from './MenuFileSave';
import MenuFileSaveAs from './MenuFileSaveAs';
import MenuFileOpen from './MenuFileOpen';
import MenuAppPreferences from './MenuAppPreferences';

interface MenuFileProps {
  menu: Electron.Menu;
  setFile(file: any): void;
}

const MenuFile = (props: MenuFileProps): ReactElement => {
  const { menu, setFile } = props;
  const isMac = remote.process.platform === 'darwin';
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'File'
  });
  const [newDocument, setNewDocument] = useState(undefined);
  const [save, setSave] = useState(undefined);
  const [saveAs, setSaveAs] = useState(undefined);
  const [open, setOpen] = useState(undefined);
  const [preferences, setPreferences] = useState(undefined);

  useEffect(() => {
    if (newDocument && save && saveAs && open && (isMac ? true : preferences)) {
      setFile({
        ...menuItemTemplate,
        submenu: [
          newDocument,
          save,
          saveAs,
          open,
          ...(!isMac ? [
            { type: 'separator' },
            preferences
          ] : []),
          { type: 'separator' },
          isMac
          ? { role: 'close' }
          : { role: 'quit' }
        ]
      });
    }
  }, [newDocument, save, saveAs, open, preferences]);

  return (
    <>
      <MenuFileNew
        menu={menu}
        setNewDocument={setNewDocument} />
      <MenuFileSave
        menu={menu}
        setSave={setSave} />
      <MenuFileSaveAs
        menu={menu}
        setSaveAs={setSaveAs} />
      <MenuFileOpen
        menu={menu}
        setOpen={setOpen} />
      {
        !isMac
        ? <MenuAppPreferences
            menu={menu}
            setPreferences={setPreferences} />
        : null
      }
    </>
  );
};

export default MenuFile;