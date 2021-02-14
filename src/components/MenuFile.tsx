import React, { ReactElement, useState, useEffect } from 'react';
import MenuFileNew from './MenuFileNew';
import MenuFileSave from './MenuFileSave';
import MenuFileSaveAs from './MenuFileSaveAs';
import MenuFileOpen from './MenuFileOpen';

interface MenuFileProps {
  setFile(file: any): void;
}

const MenuFile = (props: MenuFileProps): ReactElement => {
  const { setFile } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'File'
  });
  const [newDocument, setNewDocument] = useState(undefined);
  const [save, setSave] = useState(undefined);
  const [saveAs, setSaveAs] = useState(undefined);
  const [open, setOpen] = useState(undefined);

  useEffect(() => {
    if (newDocument && save && saveAs && open) {
      setFile({
        ...menuItem,
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
        setNewDocument={setNewDocument} />
      <MenuFileSave
        setSave={setSave} />
      <MenuFileSaveAs
        setSaveAs={setSaveAs} />
      <MenuFileOpen
        setOpen={setOpen} />
    </>
  );
};

export default MenuFile;

// import React, { ReactElement } from 'react';
// import MenuFileSave from './MenuFileSave';
// import MenuFileSaveAs from './MenuFileSaveAs';
// import MenuFileOpen from './MenuFileOpen';

// const MenuFile = (): ReactElement => (
//   <>
//     <MenuFileSave />
//     <MenuFileSaveAs />
//     <MenuFileOpen />
//   </>
// );

// export default MenuFile;