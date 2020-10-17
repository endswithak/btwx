import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuLayerStyleProps {
  canToggleFill?: boolean;
  canToggleStroke?: boolean;
  canToggleShadow?: boolean;
  fillEnabled?: boolean;
  strokeEnabled?: boolean;
  shadowEnabled?: boolean;
}

const MenuLayerStyle = (props: MenuLayerStyleProps): ReactElement => {
  const { canToggleFill, canToggleStroke, canToggleShadow, fillEnabled, strokeEnabled, shadowEnabled } = props;

  useEffect(() => {
    setMenuItems({
      layerStyleFill: {
        id: 'layerStyleFill',
        checked: fillEnabled,
        enabled: canToggleFill
      },
      layerStyleStroke: {
        id: 'layerStyleStroke',
        checked: strokeEnabled,
        enabled: canToggleStroke
      },
      layerStyleShadow: {
        id: 'layerStyleShadow',
        checked: shadowEnabled,
        enabled: canToggleShadow
      }
    });
  }, [canToggleFill, canToggleStroke, canToggleShadow, fillEnabled, strokeEnabled, shadowEnabled]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canToggleFill: boolean;
  canToggleStroke: boolean;
  canToggleShadow: boolean;
  fillEnabled: boolean;
  strokeEnabled: boolean;
  shadowEnabled: boolean;
} => {
  const { selection } = state;
  const canToggleFill = selection.canToggleFill;
  const canToggleStroke = selection.canToggleStroke;
  const canToggleShadow = selection.canToggleShadow;
  const fillEnabled = selection.fillEnabled;
  const strokeEnabled = selection.strokeEnabled;
  const shadowEnabled = selection.shadowEnabled;
  return { canToggleFill, canToggleStroke, canToggleShadow, fillEnabled, strokeEnabled, shadowEnabled };
};

export default connect(
  mapStateToProps
)(MenuLayerStyle);