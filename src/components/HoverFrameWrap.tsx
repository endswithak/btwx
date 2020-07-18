import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import HoverFrame from './HoverFrame';

interface HoverFrameWrapProps {
  hover?: string;
  isGradientEditorOpen?: boolean;
  isTextEditorOpen?: boolean;
}

const HoverFrameWrap = (props: HoverFrameWrapProps): ReactElement => {
  const { hover, isGradientEditorOpen, isTextEditorOpen } = props;

  return (
    hover && !isGradientEditorOpen && !isTextEditorOpen
    ? <HoverFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, gradientEditor, textEditor } = state;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const hover = layer.present.hover;
  return { hover, isGradientEditorOpen, isTextEditorOpen };
};

export default connect(
  mapStateToProps
)(HoverFrameWrap);