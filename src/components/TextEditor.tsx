import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TextEditorInput from './TextEditorInput';

interface TextEditorProps {
  ready: boolean;
  isOpen: boolean;
}

const TextEditor = (props: TextEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
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