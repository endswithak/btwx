import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuArrangeDistributeProps {
  canDistribute?: boolean;
  focusing?: boolean;
}

const MenuArrangeDistribute = (props: MenuArrangeDistributeProps): ReactElement => {
  const { canDistribute, focusing } = props;

  useEffect(() => {
    setMenuItems({
      arrangeDistributeHorizontally: {
        id: 'arrangeDistributeHorizontally',
        enabled: focusing && canDistribute
      },
      arrangeDistributeVertically: {
        id: 'arrangeDistributeVertically',
        enabled: focusing && canDistribute
      }
    });
  }, [canDistribute, focusing]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canDistribute: boolean;
  focusing: boolean;
} => {
  const { selection, canvasSettings } = state;
  const canDistribute = selection.canDistribute;
  const focusing = canvasSettings.focusing;
  return { canDistribute, focusing };
};

export default connect(
  mapStateToProps
)(MenuArrangeDistribute);