import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { saveDocumentThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileSave';

interface MenuFileSaveProps {
  canSave?: boolean;
  saveDocumentThunk?(): void;
}

const MenuFileSave = (props: MenuFileSaveProps): ReactElement => {
  const { canSave, saveDocumentThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canSave;
  }, [canSave]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      saveDocumentThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canSave: boolean;
} => {
  const { layer, documentSettings } = state;
  const canSave = layer.present.edit && layer.present.edit.id !== documentSettings.edit;
  return { canSave };
};

export default connect(
  mapStateToProps,
  { saveDocumentThunk }
)(MenuFileSave);