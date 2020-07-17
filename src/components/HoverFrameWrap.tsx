import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import HoverFrame from './HoverFrame';

interface HoverFrameWrapProps {
  hover?: string;
  isGradientEditorOpen?: boolean;
}

const HoverFrameWrap = (props: HoverFrameWrapProps): ReactElement => {
  const { hover, isGradientEditorOpen } = props;

  return (
    hover && !isGradientEditorOpen
    ? <HoverFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, gradientEditor } = state;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const hover = layer.present.hover;
  return { hover, isGradientEditorOpen };
};

export default connect(
  mapStateToProps
)(HoverFrameWrap);