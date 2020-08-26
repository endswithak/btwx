import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import TextEditorInput from './TextEditorInput';

interface TextEditorProps {
  ready: boolean;
  isOpen: boolean;
}

const TextEditor = (props: TextEditorProps): ReactElement => {
  const { ready, isOpen } = props;

  return (
    isOpen
    ? ready
      ? <TextEditorInput />
      : null
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { textEditor } = state;
  const isOpen = textEditor.isOpen;
  return { isOpen };
};

export default connect(
  mapStateToProps,
)(TextEditor);