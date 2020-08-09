import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import EaseEditor from './EaseEditor';

interface EaseEditorWrapProps {
  isOpen: boolean;
}

const EaseEditorWrap = (props: EaseEditorWrapProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isOpen } = props;

  return (
    isOpen
    ? <EaseEditor />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { easeEditor } = state;
  const isOpen = easeEditor.isOpen;
  return { isOpen };
};

export default connect(
  mapStateToProps,
)(EaseEditorWrap);