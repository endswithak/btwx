import React, { ReactElement, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { ipcRenderer } from 'electron';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

const AutoSaver = (): ReactElement => {
  const autoSave = useSelector((state: RootState) => state.preferences.autoSave);
  const edit = useSelector((state: RootState) => state.layer.present.edit);
  const documentId = useSelector((state: RootState) => state.documentSettings.id);

  const debounceSave = useCallback(debounce(() => {
    ipcRenderer.send('saveInstance');
  }, 500), []);

  useEffect(() => {
    if (edit.undoable && autoSave && documentId) {
      debounceSave();
    }
  }, [edit, autoSave, documentId]);

  return null;
}

export default AutoSaver;