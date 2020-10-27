import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleTweenDrawerThunk } from '../store/actions/viewSettings';

export const MENU_ITEM_ID = 'viewShowEvents';

interface MenuViewShowEventsProps {
  isChecked?: boolean;
  toggleTweenDrawerThunk?(): void;
}

const MenuViewShowEvents = (props: MenuViewShowEventsProps): ReactElement => {
  const { isChecked, toggleTweenDrawerThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = isChecked;
  }, [isChecked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      toggleTweenDrawerThunk();
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
  const isChecked = viewSettings.tweenDrawer.isOpen;
  return { isChecked };
};

export default connect(
  mapStateToProps,
  { toggleTweenDrawerThunk }
)(MenuViewShowEvents);