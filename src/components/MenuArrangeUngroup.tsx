import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';

export const MENU_ITEM_ID = 'arrangeUngroup';

interface MenuArrangeUngroupProps {
  canUngroup?: boolean;
  ungroupSelectedThunk?(): void;
}

const MenuArrangeUngroup = (props: MenuArrangeUngroupProps): ReactElement => {
  const { canUngroup, ungroupSelectedThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = canUngroup;
  }, [canUngroup]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      ungroupSelectedThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canUngroup: boolean;
} => {
  const canUngroup = canUngroupSelected(state);
  return { canUngroup };
};

export default connect(
  mapStateToProps,
  { ungroupSelectedThunk }
)(MenuArrangeUngroup);