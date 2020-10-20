import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuLayerMaskProps {
  ignoreUnderlyingMaskEnabled: boolean;
  useAsMaskEnabled: boolean;
  canToggleUseAsMask: boolean;
}

const MenuLayerMask = (props: MenuLayerMaskProps): ReactElement => {
  const { ignoreUnderlyingMaskEnabled, useAsMaskEnabled, canToggleUseAsMask } = props;

  useEffect(() => {
    setMenuItems({
      layerMaskUseAsMask: {
        id: 'layerMaskUseAsMask',
        enabled: canToggleUseAsMask,
        checked: useAsMaskEnabled
      },
      layerMaskIgnoreUnderlyingMask: {
        id: 'layerMaskIgnoreUnderlyingMask',
        enabled: true,
        checked: ignoreUnderlyingMaskEnabled
      }
    });
  }, [ignoreUnderlyingMaskEnabled, useAsMaskEnabled, canToggleUseAsMask]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  ignoreUnderlyingMaskEnabled: boolean;
  useAsMaskEnabled: boolean;
  canToggleUseAsMask: boolean;
} => {
  const { selection } = state;
  const ignoreUnderlyingMaskEnabled = selection.ignoreUnderlyingMaskEnabled;
  const useAsMaskEnabled = selection.useAsMaskEnabled;
  const canToggleUseAsMask = selection.canToggleUseAsMask;
  return { ignoreUnderlyingMaskEnabled, useAsMaskEnabled, canToggleUseAsMask };
};

export default connect(
  mapStateToProps
)(MenuLayerMask);