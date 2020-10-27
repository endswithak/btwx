import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleLeftSidebarThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowLayers';

interface MenuViewShowLayersProps {
  isChecked?: boolean;
  toggleLeftSidebarThunk?(): void;
}

const MenuViewShowLayers = (props: MenuViewShowLayersProps): ReactElement => {
  const { isChecked, toggleLeftSidebarThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleLeftSidebarThunk();
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
  const isChecked = viewSettings.leftSidebar.isOpen;
  return { isChecked };
};

export default connect(
  mapStateToProps,
  { toggleLeftSidebarThunk }
)(MenuViewShowLayers);