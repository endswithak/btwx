import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TextEditorInput from './TextEditorInput';

interface TextEditorProps {
  isOpen: boolean;
}

const TextEditor = (props: TextEditorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isOpen } = props;

  return (
    isOpen
    ? <TextEditorInput />
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