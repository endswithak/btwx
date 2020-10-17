import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuLayerTransformProps {
  canToggleFlip?: boolean;
  verticalFlipEnabled?: boolean;
  horizontalFlipEnabled?: boolean;
}

const MenuLayerTransform = (props: MenuLayerTransformProps): ReactElement => {
  const { canToggleFlip, verticalFlipEnabled, horizontalFlipEnabled } = props;

  useEffect(() => {
    setMenuItems({
      layerTransformFlipHorizontally: {
        id: 'layerTransformFlipHorizontally',
        checked: horizontalFlipEnabled,
        enabled: canToggleFlip
      },
      layerTransformFlipVertically: {
        id: 'layerTransformFlipVertically',
        checked: verticalFlipEnabled,
        enabled: canToggleFlip
      }
    });
  }, [canToggleFlip, verticalFlipEnabled, horizontalFlipEnabled]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canToggleFlip: boolean;
  verticalFlipEnabled: boolean;
  horizontalFlipEnabled: boolean;
} => {
  const { selection } = state;
  const canToggleFlip = selection.canToggleFlip;
  const verticalFlipEnabled = selection.verticalFlipEnabled;
  const horizontalFlipEnabled = selection.horizontalFlipEnabled;
  return { canToggleFlip, verticalFlipEnabled, horizontalFlipEnabled };
};

export default connect(
  mapStateToProps
)(MenuLayerTransform);