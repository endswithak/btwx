import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import TextEditorInput from './TextEditorInput';

interface TextEditorProps {
  ready: boolean;
}

const TextEditor = (props: TextEditorProps): ReactElement => {
  const { ready } = props;
  const isOpen = useSelector((state: RootState) => state.textEditor.isOpen);

  return (
    isOpen
    ? ready
      ? <TextEditorInput />
      : null
    : null
  );
}

export default TextEditor;