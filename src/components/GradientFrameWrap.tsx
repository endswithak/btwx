import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import GradientFrame from './GradientFrame';

interface GradientFrameWrapProps {
  layer?: string;
  prop?: 'fill' | 'stroke';
  isOpen?: boolean;
}

const GradientFrameWrap = (props: GradientFrameWrapProps): ReactElement => {
  const { layer, prop, isOpen } = props;

  return (
    isOpen && layer
    ? <GradientFrame
        layer={layer}
        prop={prop} />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { fillRadialGradientEditor, fillLinearGradientEditor } = state;
  const isOpen = fillRadialGradientEditor.isOpen || fillLinearGradientEditor.isOpen;
  const prop = 'fill';
  const layer = (() => {
    if (fillRadialGradientEditor.isOpen) {
      return fillRadialGradientEditor.layer;
    } else if (fillLinearGradientEditor.isOpen) {
      return fillLinearGradientEditor.layer;
    } else {
      return null;
    }
  })();
  return { layer, isOpen, prop };
};

export default connect(
  mapStateToProps
)(GradientFrameWrap);