import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuLayerMaskProps {
  canMask?: boolean;
}

const MenuLayerMask = (props: MenuLayerMaskProps): ReactElement => {
  const { canMask } = props;

  useEffect(() => {
    setMenuItems({
      layerMask: {
        id: 'layerMask',
        enabled: canMask
      }
    });
  }, [canMask]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canMask: boolean;
} => {
  const { selection } = state;
  const canMask = selection.canMask;
  return { canMask };
};

export default connect(
  mapStateToProps
)(MenuLayerMask);