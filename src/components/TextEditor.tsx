import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import TextEditorInput from './TextEditorInput';

const TextEditor = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const isOpen = useSelector((state: RootState) => state.textEditor.isOpen);

  return (
    isOpen && ready
    ? <TextEditorInput />
    : null
  );
}

export default TextEditor;