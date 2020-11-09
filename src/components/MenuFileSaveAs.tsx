import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { saveDocumentAsThunk } from '../store/actions/documentSettings';

export const MENU_ITEM_ID = 'fileSaveAs';

interface MenuFileSaveAsProps {
  canSave?: boolean;
  saveDocumentAsThunk?(): Promise<any>;
}

const MenuFileSaveAs = (props: MenuFileSaveAsProps): ReactElement => {
  const { canSave, saveDocumentAsThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
  }, [canSave]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        saveDocumentAsThunk().then(() => {
          resolve();
        });
      })
    };
  }, []);

  return (
    <></>
  );
}

export default connect(
  null,
  { saveDocumentAsThunk }
)(MenuFileSaveAs);