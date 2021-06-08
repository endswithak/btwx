import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import ArtboardPresetEditor from './ArtboardPresetEditor';

const ArtboardPresetEditorWrap = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const isOpen = useSelector((state: RootState) => state.artboardPresetEditor.isOpen);

  return (
    ready && isOpen
    ? <ArtboardPresetEditor />
    : null
  );
}

export default ArtboardPresetEditorWrap;