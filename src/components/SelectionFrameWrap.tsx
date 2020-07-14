import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SelectionFrame from './SelectionFrame';

interface SelectionFrameWrapProps {
  selected?: string[];
  isGradientEditorOpen?: boolean;
}

const SelectionFrameWrap = (props: SelectionFrameWrapProps): ReactElement => {
  const { selected, isGradientEditorOpen } = props;

  return (
    selected.length > 0 && !isGradientEditorOpen
    ? <SelectionFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, fillRadialGradientEditor, fillLinearGradientEditor } = state;
  const isGradientEditorOpen = fillRadialGradientEditor.isOpen || fillLinearGradientEditor.isOpen;
  const selected = layer.present.selected;
  return { selected, isGradientEditorOpen };
};

export default connect(
  mapStateToProps
)(SelectionFrameWrap);