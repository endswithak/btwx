import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import FillColorEditor from './FillColorEditor';
import FillGradientEditor from './FillGradientEditor';

interface FillEditorProps {
  isColorEditorOpen?: boolean;
  isGradientEditorOpen?: boolean;
}

const FillEditor = (props: FillEditorProps): ReactElement => {
  const { isColorEditorOpen, isGradientEditorOpen } = props;

  return (
    <>
      {
        isColorEditorOpen
        ? <FillColorEditor />
        : null
      }
      {
        isGradientEditorOpen
        ? <FillGradientEditor />
        : null
      }
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillColorEditor, fillGradientEditor } = state;
  const isGradientEditorOpen = fillGradientEditor.isOpen;
  const isColorEditorOpen = fillColorEditor.isOpen;
  return { isColorEditorOpen, isGradientEditorOpen };
};

export default connect(
  mapStateToProps
)(FillEditor);