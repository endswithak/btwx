import { useSelector } from 'react-redux';
import React, { ReactElement, useEffect, useState } from 'react';
import { RootState } from '../store/reducers';
import MenuFileNew from './MenuFileNew';
import MenuFileSave from './MenuFileSave';
import MenuFileSaveAs from './MenuFileSaveAs';
import MenuFileOpen from './MenuFileOpen';
import MenuAppPreferences from './MenuAppPreferences';

interface MenuFileProps {
  setFile(file: any): void;
}

const MenuFile = (props: MenuFileProps): ReactElement => {
  const { setFile } = props;
  const isMac = useSelector((state: RootState) => state.session.platform === 'darwin');
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'File'
  });
  const [newDocument, setNewDocument] = useState(undefined);
  const [save, setSave] = useState(undefined);
  const [saveAs, setSaveAs] = useState(undefined);
  const [open, setOpen] = useState(undefined);
  const [preferences, setPreferences] = useState(undefined);

  useEffect(() => {
    if (newDocument && save && saveAs && open && preferences) {
      setFile({
        ...menuItemTemplate,
        submenu: [
          newDocument,
          save,
          saveAs,
          open,
          {
            label: 'Open Recent',
            role: 'recentDocuments',
            submenu: [
              {
                role: 'clearRecentDocuments'
              }
            ]
          },
          ...!isMac ? [ { type: 'separator' }, preferences ] : [],
          { type: 'separator' },
          isMac ? { role: 'close' } : { role: 'quit' }
        ]
      });
    }
  }, [newDocument, save, saveAs, open, preferences]);

  return (
    <>
      <MenuFileNew
        setNewDocument={setNewDocument} />
      <MenuFileSave
        setSave={setSave} />
      <MenuFileSaveAs
        setSaveAs={setSaveAs} />
      <MenuFileOpen
        setOpen={setOpen} />
      <MenuAppPreferences
        setPreferences={setPreferences} />
    </>
  );
};

export default MenuFile;