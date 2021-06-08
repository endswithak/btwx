import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import ColorEditor from './ColorEditor';
import GradientEditor from './GradientEditor';

const SwatchEditor = (): ReactElement => {
  const isGradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const isColorEditorOpen = useSelector((state: RootState) => state.colorEditor.isOpen);

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

export default SwatchEditor;