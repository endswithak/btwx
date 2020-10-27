import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
// import { RootState } from '../store/reducers';
import { saveDocumentAsThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileSaveAs';

interface MenuFileSaveAsProps {
  canSave?: boolean;
  saveDocumentAsThunk?(): void;
}

const MenuFileSaveAs = (props: MenuFileSaveAsProps): ReactElement => {
  const { canSave, saveDocumentAsThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
  }, [canSave]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      saveDocumentAsThunk();
    };
  }, []);

  return (
    <></>
  );
}

// const mapStateToProps = (state: RootState): {
//   canSave: boolean;
// } => {
//   const { layer, documentSettings } = state;
//   const canSave = layer.present.edit !== documentSettings.edit || documentSettings.edit === null;
//   return { canSave };
// };

export default connect(
  null,
  { saveDocumentAsThunk }
)(MenuFileSaveAs);