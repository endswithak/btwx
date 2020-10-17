import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuLayerCombineProps {
  canBoolean?: boolean;
}

const MenuLayerCombine = (props: MenuLayerCombineProps): ReactElement => {
  const { canBoolean } = props;

  useEffect(() => {
    setMenuItems({
      layerCombineUnion: {
        id: 'layerCombineUnion',
        enabled: canBoolean
      },
      layerCombineDifference: {
        id: 'layerCombineDifference',
        enabled: canBoolean
      },
      layerCombineSubtract: {
        id: 'layerCombineSubtract',
        enabled: canBoolean
      },
      layerCombineIntersect: {
        id: 'layerCombineIntersect',
        enabled: canBoolean
      }
    });
  }, [canBoolean]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canBoolean: boolean;
} => {
  const { selection } = state;
  const canBoolean = selection.canBoolean;
  return { canBoolean };
};

export default connect(
  mapStateToProps
)(MenuLayerCombine);