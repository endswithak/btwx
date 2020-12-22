import React, { ReactElement } from 'react';
import MenuEditUndo from './MenuEditUndo';
import MenuEditRedo from './MenuEditRedo';
import MenuEditCut from './MenuEditCut';
import MenuEditCopy from './MenuEditCopy';
import MenuEditCopySVG from './MenuEditCopySVG';
import MenuEditCopyStyle from './MenuEditCopyStyle';
import MenuEditPaste from './MenuEditPaste';
import MenuEditPasteOverSelection from './MenuEditPasteOverSelection';
import MenuEditPasteSVG from './MenuEditPasteSVG';
import MenuEditPasteStyle from './MenuEditPasteStyle';
import MenuEditDelete from './MenuEditDelete';
import MenuEditDuplicate from './MenuEditDuplicate';
import MenuEditSelectAll from './MenuEditSelectAll';
import MenuEditSelectAllArtboards from './MenuEditSelectAllArtboards';
import MenuEditFind from './MenuEditFind';
import MenuEditRename from './MenuEditRename';

const MenuEdit = (): ReactElement => (
  <>
    <MenuEditUndo />
    <MenuEditRedo />
    <MenuEditCut />
    <MenuEditCopy />
    <MenuEditCopySVG />
    <MenuEditCopyStyle />
    <MenuEditPaste />
    <MenuEditPasteOverSelection />
    <MenuEditPasteSVG />
    <MenuEditPasteStyle />
    <MenuEditDelete />
    <MenuEditDuplicate />
    <MenuEditSelectAll />
    <MenuEditSelectAllArtboards />
    <MenuEditFind />
    <MenuEditRename />
  </>
);

export default MenuEdit;