import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ShadowColorEditor from './ShadowColorEditor';

interface ShadowEditorProps {
  isColorEditorOpen?: boolean;
}

const ShadowEditor = (props: ShadowEditorProps): ReactElement => {
  const { isColorEditorOpen } = props;

  return (
    <>
      {
        isColorEditorOpen
        ? <ShadowColorEditor />
        : null
      }
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { shadowColorEditor } = state;
  const isColorEditorOpen = shadowColorEditor.isOpen;
  return { isColorEditorOpen };
};

export default connect(
  mapStateToProps
)(ShadowEditor);