import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ArtboardPresetEditor from './ArtboardPresetEditor';

interface ArtboardPresetEditorWrapProps {
  isOpen?: boolean;
}

const ArtboardPresetEditorWrap = (props: ArtboardPresetEditorWrapProps): ReactElement => {
  const { isOpen } = props;

  return (
    isOpen
    ? <ArtboardPresetEditor />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { artboardPresetEditor } = state;
  const isOpen = artboardPresetEditor.isOpen;
  return { isOpen };
};

export default connect(
  mapStateToProps
)(ArtboardPresetEditorWrap);