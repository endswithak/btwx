import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { sendSelectedBackwardThunk } from '../store/actions/layer';
import { canSendSelectedBackward } from '../store/selectors/layer';

export const MENU_ITEM_ID = 'arrangeSendBackward';

interface MenuArrangeSendBackwardProps {
  isEnabled?: boolean;
  sendSelectedBackwardThunk?(): void;
}

const MenuArrangeSendBackward = (props: MenuArrangeSendBackwardProps): ReactElement => {
  const { isEnabled, sendSelectedBackwardThunk } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (): void => {
      sendSelectedBackwardThunk();
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { canvasSettings } = state;
  const isEnabled = canSendSelectedBackward(state) && canvasSettings.focusing;
  return { isEnabled };
};

export default connect(
  mapStateToProps,
  { sendSelectedBackwardThunk }
)(MenuArrangeSendBackward);