import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuArrangeGroupProps {
  canGroup?: boolean;
  canUngroup?: boolean;
  focusing?: boolean;
}

const MenuArrangeGroup = (props: MenuArrangeGroupProps): ReactElement => {
  const { canGroup, canUngroup, focusing } = props;

  useEffect(() => {
    setMenuItems({
      arrangeGroup: {
        id: 'arrangeGroup',
        enabled: focusing && canGroup
      },
      arrangeUngroup: {
        id: 'arrangeUngroup',
        enabled: focusing && canUngroup
      }
    });
  }, [canGroup, canUngroup, focusing]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canGroup: boolean;
  canUngroup: boolean;
  focusing: boolean;
} => {
  const { selection, canvasSettings } = state;
  const canGroup = selection.canGroup;
  const canUngroup = selection.canUngroup;
  const focusing = canvasSettings.focusing;
  return { canGroup, canUngroup, focusing };
};

export default connect(
  mapStateToProps
)(MenuArrangeGroup);