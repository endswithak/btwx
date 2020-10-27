import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { canGroupSelected } from '../store/selectors/layer';
import { groupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeGroup';

interface MenuArrangeGroupProps {
  canGroup?: boolean;
  groupSelectedThunk?(): void;
}

const MenuArrangeGroup = (props: MenuArrangeGroupProps): ReactElement => {
  const { canGroup, groupSelectedThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canGroup;
  }, [canGroup]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      groupSelectedThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canGroup: boolean;
} => {
  const canGroup = canGroupSelected(state);
  return { canGroup };
};

export default connect(
  mapStateToProps,
  { groupSelectedThunk }
)(MenuArrangeGroup);