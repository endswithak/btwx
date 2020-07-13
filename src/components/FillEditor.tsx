import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import FillColorEditor from './FillColorEditor';
import FillRadialGradientEditor from './FillRadialGradientEditor';
import FillLinearGradientEditor from './FillLinearGradientEditor';

interface FillEditorProps {
  isColorEditorOpen?: boolean;
  isLinearGradientEditorOpen?: boolean;
  isRadialGradientEditorOpen?: boolean;
}

const FillEditor = (props: FillEditorProps): ReactElement => {
  const { isColorEditorOpen, isLinearGradientEditorOpen, isRadialGradientEditorOpen } = props;

  return (
    <>
      {
        isColorEditorOpen
        ? <FillColorEditor />
        : null
      }
      {
        isLinearGradientEditorOpen
        ? <FillLinearGradientEditor />
        : null
      }
      {
        isRadialGradientEditorOpen
        ? <FillRadialGradientEditor />
        : null
      }
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillColorEditor, fillLinearGradientEditor, fillRadialGradientEditor } = state;
  const isLinearGradientEditorOpen = fillLinearGradientEditor.isOpen;
  const isRadialGradientEditorOpen = fillRadialGradientEditor.isOpen;
  const isColorEditorOpen = fillColorEditor.isOpen;
  return { isColorEditorOpen, isLinearGradientEditorOpen, isRadialGradientEditorOpen };
};

export default connect(
  mapStateToProps
)(FillEditor);