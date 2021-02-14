import React, { ReactElement, useState, useEffect } from 'react';
import MenuFileNew from './MenuFileNew';
import MenuFileSave from './MenuFileSave';
import MenuFileSaveAs from './MenuFileSaveAs';
import MenuFileOpen from './MenuFileOpen';

interface MenuFileProps {
  menu: Electron.Menu;
  setFile(file: any): void;
}

const MenuFile = (props: MenuFileProps): ReactElement => {
  const { menu, setFile } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'File'
  });
  const [newDocument, setNewDocument] = useState(undefined);
  const [save, setSave] = useState(undefined);
  const [saveAs, setSaveAs] = useState(undefined);
  const [open, setOpen] = useState(undefined);

  useEffect(() => {
    if (newDocument && save && saveAs && open) {
      setFile({
        ...menuItemTemplate,
        submenu: [
          newDocument,
          save,
          saveAs,
          open
        ]
      });
    }
  }, [newDocument, save, saveAs, open]);

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
    </>
  );
};

export default MenuFile;