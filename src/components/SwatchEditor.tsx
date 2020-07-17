import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ColorEditor from './ColorEditor';
import GradientEditor from './GradientEditor';

interface SwatchEditorProps {
  isColorEditorOpen?: boolean;
  isGradientEditorOpen?: boolean;
}

const SwatchEditor = (props: SwatchEditorProps): ReactElement => {
  const { isColorEditorOpen, isGradientEditorOpen } = props;

  return (
    <>
      {
        isColorEditorOpen
        ? <ColorEditor />
        : null
      }
      {
        isGradientEditorOpen
        ? <GradientEditor />
        : null
      }
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { colorEditor, gradientEditor } = state;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isColorEditorOpen = colorEditor.isOpen;
  return { isColorEditorOpen, isGradientEditorOpen };
};

export default connect(
  mapStateToProps
)(SwatchEditor);