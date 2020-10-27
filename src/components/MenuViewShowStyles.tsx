import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleRightSidebarThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowStyles';

interface MenuViewShowStylesProps {
  isChecked?: boolean;
  toggleRightSidebarThunk?(): void;
}

const MenuViewShowStyles = (props: MenuViewShowStylesProps): ReactElement => {
  const { isChecked, toggleRightSidebarThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleRightSidebarThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isChecked: boolean;
} => {
  const { viewSettings } = state;
  const isChecked = viewSettings.rightSidebar.isOpen;
  return { isChecked };
};

export default connect(
  mapStateToProps,
  { toggleRightSidebarThunk }
)(MenuViewShowStyles);