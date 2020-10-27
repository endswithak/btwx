import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
// import { RootState } from '../store/reducers';
import { openDocumentThunk } from '../store/actions/documentSettings';
import { APP_NAME } from '../constants';

export const MENU_ITEM_ID = 'fileOpen';

interface MenuFileOpenProps {
  openDocumentThunk?(filePath: string): void;
}

const MenuFileOpen = (props: MenuFileOpenProps): ReactElement => {
  const { openDocumentThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    (window as any)[MENU_ITEM_ID] = (): void => {
      remote.dialog.showOpenDialog({
        filters: [
          { name: 'Custom File Type', extensions: [APP_NAME] }
        ],
        properties: ['openFile']
      }).then((result) => {
        if (result.filePaths.length > 0 && !result.canceled) {
          openDocumentThunk(result.filePaths[0]);
        }
      });
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
  { openDocumentThunk }
)(MenuFileOpen);