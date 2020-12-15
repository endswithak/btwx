import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import ArtboardPresetEditor from './ArtboardPresetEditor';

const ArtboardPresetEditorWrap = (): ReactElement => {
  const isOpen = useSelector((state: RootState) => state.artboardPresetEditor.isOpen);

  return (
    isOpen
    ? <ArtboardPresetEditor />
    : null
  );
}

export default ArtboardPresetEditorWrap;