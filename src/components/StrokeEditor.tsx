import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import StrokeColorEditor from './StrokeColorEditor';
import StrokeGradientEditor from './StrokeGradientEditor';

interface StrokeEditorProps {
  isColorEditorOpen?: boolean;
  isGradientEditorOpen?: boolean;
}

const StrokeEditor = (props: StrokeEditorProps): ReactElement => {
  const { isColorEditorOpen, isGradientEditorOpen } = props;

  return (
    <>
      {
        isColorEditorOpen
        ? <StrokeColorEditor />
        : null
      }
      {
        isGradientEditorOpen
        ? <StrokeGradientEditor />
        : null
      }
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { strokeColorEditor, strokeGradientEditor } = state;
  const isGradientEditorOpen = strokeGradientEditor.isOpen;
  const isColorEditorOpen = strokeColorEditor.isOpen;
  return { isColorEditorOpen, isGradientEditorOpen };
};

export default connect(
  mapStateToProps
)(StrokeEditor);