import React, { ReactElement, useState, useEffect } from 'react';
import MenuEditUndo from './MenuEditUndo';
import MenuEditRedo from './MenuEditRedo';
import MenuEditCut from './MenuEditCut';
import MenuEditCopy from './MenuEditCopy';
import MenuEditPaste from './MenuEditPaste';
import MenuEditDelete from './MenuEditDelete';
import MenuEditDuplicate from './MenuEditDuplicate';
import MenuEditSelect from './MenuEditSelect';
import MenuEditFind from './MenuEditFind';
import MenuEditRename from './MenuEditRename';

interface MenuEditProps {
  setEdit(edit: any): void;
}

const MenuEdit = (props: MenuEditProps): ReactElement => {
  const { setEdit } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Edit'
  });
  const [undo, setUndo] = useState(undefined);
  const [redo, setRedo] = useState(undefined);
  const [cut, setCut] = useState(undefined);
  const [copy, setCopy] = useState(undefined);
  const [paste, setPaste] = useState(undefined);
  const [deleteLayers, setDeleteLayers] = useState(undefined);
  const [duplicate, setDuplicate] = useState(undefined);
  const [select, setSelect] = useState(undefined);
  const [find, setFind] = useState(undefined);
  const [rename, setRename] = useState(undefined);

  useEffect(() => {
    if (undo && redo && cut && copy && paste) {
      setEdit({
        ...menuItem,
        submenu: [
          undo,
          redo,
          { type: 'separator' },
          cut,
          copy,
          paste,
          deleteLayers,
          { type: 'separator' },
          duplicate,
          { type: 'separator' },
          select,
          { type: 'separator' },
          find,
          rename
        ]
      });
    }
  }, [undo, redo, cut, copy, paste, duplicate, select, find, rename]);

  return (
    <>
      <MenuEditUndo
        setUndo={setUndo} />
      <MenuEditRedo
        setRedo={setRedo} />
      <MenuEditCut
        setCut={setCut} />
      <MenuEditCopy
        setCopy={setCopy} />
      <MenuEditPaste
        setPaste={setPaste} />
      <MenuEditDelete
        setDeleteLayers={setDeleteLayers} />
      <MenuEditDuplicate
        setDuplicate={setDuplicate} />
      <MenuEditSelect
        setSelect={setSelect} />
      <MenuEditFind
        setFind={setFind} />
      <MenuEditRename
        setRename={setRename} />
    </>
  );
};

export default MenuEdit;

// import React, { ReactElement } from 'react';
// import MenuEditUndo from './MenuEditUndo';
// import MenuEditRedo from './MenuEditRedo';
// import MenuEditCut from './MenuEditCut';
// import MenuEditCopy from './MenuEditCopy';
// import MenuEditCopySVG from './MenuEditCopySVG';
// import MenuEditCopyStyle from './MenuEditCopyStyle';
// import MenuEditPaste from './MenuEditPaste';
// import MenuEditPasteOverSelection from './MenuEditPasteOverSelection';
// import MenuEditPasteSVG from './MenuEditPasteSVG';
// import MenuEditPasteStyle from './MenuEditPasteStyle';
// import MenuEditDelete from './MenuEditDelete';
// import MenuEditDuplicate from './MenuEditDuplicate';
// import MenuEditSelectAll from './MenuEditSelectAll';
// import MenuEditSelectAllArtboards from './MenuEditSelectAllArtboards';
// import MenuEditFind from './MenuEditFind';
// import MenuEditRename from './MenuEditRename';

// const MenuEdit = (): ReactElement => (
//   <>
//     <MenuEditUndo />
//     <MenuEditRedo />
//     <MenuEditCut />
//     <MenuEditCopy />
//     <MenuEditCopySVG />
//     <MenuEditCopyStyle />
//     <MenuEditPaste />
//     <MenuEditPasteOverSelection />
//     <MenuEditPasteSVG />
//     <MenuEditPasteStyle />
//     <MenuEditDelete />
//     <MenuEditDuplicate />
//     <MenuEditSelectAll />
//     <MenuEditSelectAllArtboards />
//     <MenuEditFind />
//     <MenuEditRename />
//   </>
// );

// export default MenuEdit;