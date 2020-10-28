import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SelectionFrame from './SelectionFrame';

interface SelectionFrameWrapProps {
  isEnabled?: boolean;
}

const SelectionFrameWrap = (props: SelectionFrameWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <SelectionFrame />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { layer, gradientEditor, textEditor, canvasSettings } = state;
  const isZooming = canvasSettings.zooming;
  const isDragging = canvasSettings.dragging;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const selected = layer.present.selected;
  const isEnabled = selected.length > 0 && !isGradientEditorOpen && !isTextEditorOpen && !isZooming && !isDragging;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(SelectionFrameWrap);