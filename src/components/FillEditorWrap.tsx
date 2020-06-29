import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import FillEditor from './FillEditor';

interface FillEditorWrapProps {
  isOpen?: boolean;
}

const FillEditorWrap = (props: FillEditorWrapProps): ReactElement => {
  const { isOpen } = props;

  return (
    isOpen
    ? <FillEditor />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillEditor } = state;
  const isOpen = fillEditor.isOpen;
  return { isOpen };
};

export default connect(
  mapStateToProps
)(FillEditorWrap);