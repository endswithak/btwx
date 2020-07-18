import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SelectionFrame from './SelectionFrame';

interface SelectionFrameWrapProps {
  selected?: string[];
  isGradientEditorOpen?: boolean;
  isTextEditorOpen?: boolean;
}

const SelectionFrameWrap = (props: SelectionFrameWrapProps): ReactElement => {
  const { selected, isGradientEditorOpen, isTextEditorOpen } = props;

  return (
    selected.length > 0 && !isGradientEditorOpen && !isTextEditorOpen
    ? <SelectionFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, gradientEditor, textEditor } = state;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const selected = layer.present.selected;
  return { selected, isGradientEditorOpen, isTextEditorOpen };
};

export default connect(
  mapStateToProps
)(SelectionFrameWrap);